"use client";

import React from "react";
import { Typography, theme } from "antd";
import { motion, Variants } from "framer-motion";

interface AppLoaderProps {
  tip?: string;
  fullPage?: boolean;
}

export const AppLoader: React.FC<AppLoaderProps> = ({
  tip = "Завантаження розкладу...",
  fullPage = false,
}) => {
  const { token } = theme.useToken();

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "24px",
    width: "100%",
    height: fullPage ? "100vh" : "300px",
    minHeight: "250px",
    background: fullPage ? "var(--ant-color-bg-layout)" : "transparent",
  };

  const containerVariants: Variants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    initial: { opacity: 0.3, scaleX: 0.8 },
    animate: {
      opacity: [0.3, 0.8, 0.3],
      scaleX: [0.95, 1, 0.95],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div style={containerStyle}>
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          width: "100%",
          maxWidth: "280px",
          alignItems: "center",
        }}
      >
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            style={{
              width: i === 2 ? "100%" : "85%",
              height: "12px",
              background: `linear-gradient(90deg, ${token.colorPrimary}22, ${token.colorPrimary}66, ${token.colorPrimary}22)`,
              borderRadius: "6px",
            }}
          />
        ))}

        <motion.div
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            marginTop: "8px",
            width: "20px",
            height: "20px",
            border: `2px solid ${token.colorPrimary}`,
            borderTopColor: "transparent",
            borderRadius: "50%",
          }}
        />
      </motion.div>

      {tip && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Typography.Text
            strong
            style={{
              fontSize: "15px",
              color: token.colorTextDescription,
              letterSpacing: "0.5px",
            }}
          >
            {tip}
          </Typography.Text>
        </motion.div>
      )}
    </div>
  );
};
