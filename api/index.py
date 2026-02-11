from flask import Flask, request, Response
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

UNI_MAP = {
    "nuzp": "https://api.zp.edu.ua"
}

@app.route('/api/proxy/<uni_id>/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
def proxy(uni_id, path):
    if uni_id not in UNI_MAP:
        return {"error": "University not found"}, 404

    target_url = f"{UNI_MAP[uni_id]}/{path}"
    
    headers = {k: v for k, v in request.headers if k.lower() not in ['host', 'content-length']}

    try:
        resp = requests.request(
            method=request.method,
            url=target_url,
            headers=headers,
            data=request.get_data(),
            params=request.args,
            cookies=request.cookies,
            allow_redirects=False
        )
        excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
        headers = [(name, value) for (name, value) in resp.raw.headers.items()
                   if name.lower() not in excluded_headers]

        return Response(resp.content, resp.status_code, headers)

    except Exception as e:
        return {"error": str(e)}, 500


if __name__ == "__main__":
    app.run()