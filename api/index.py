import requests
import hashlib
from flask import Flask, request, Response, jsonify
from flask_cors import CORS
from flask_caching import Cache

app = Flask(__name__)
CORS(app)

cache = Cache(app, config={
    'CACHE_TYPE': 'FileSystemCache',
    'CACHE_DIR': '/tmp/flask_cache',
    'CACHE_DEFAULT_TIMEOUT': 3600 
})

UNI_MAP = {
    "nuzp": "https://api.zp.edu.ua",
    "knu": "https://api.knu.ua",
    "lpnu": "https://api.lpnu.ua"
}

def make_cache_key():
    data = request.get_data()
    key_source = f"{request.method}:{request.url}:{data}"
    return hashlib.md_value(key_source.encode('utf-8')).hexdigest()

@app.route('/api/proxy/<uni_id>/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
def proxy(uni_id, path):
    if request.method == 'OPTIONS':
        return Response(status=200)

    base_url = UNI_MAP.get(uni_id)
    if not base_url:
        return jsonify({"error": f"University '{uni_id}' not supported"}), 404

    if request.method in ['GET', 'POST']:
        cache_key = make_cache_key()
        cached_response = cache.get(cache_key)
        if cached_response:
            resp = Response(cached_response['content'], cached_response['status'], cached_response['headers'])
            resp.headers['X-Proxy-Cache'] = 'HIT'
            return resp

    target_url = f"{base_url}/{path}"
    headers = {k: v for k, v in request.headers if k.lower() not in ['host', 'content-length']}

    try:
        resp = requests.request(
            method=request.method,
            url=target_url,
            headers=headers,
            data=request.get_data(),
            params=request.args,
            cookies=request.cookies,
            allow_redirects=False,
            timeout=15
        )

        excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
        resp_headers = [(name, value) for (name, value) in resp.raw.headers.items()
                        if name.lower() not in excluded_headers]

    
        if request.method in ['GET', 'POST'] and resp.status_code == 200:
            cache.set(make_cache_key(), {
                'content': resp.content,
                'status': resp.status_code,
                'headers': resp_headers
            })

        final_resp = Response(resp.content, resp.status_code, resp_headers)
        final_resp.headers['X-Proxy-Cache'] = 'MISS'
        return final_resp

    except Exception as e:
        return jsonify({"error": str(e)}), 500