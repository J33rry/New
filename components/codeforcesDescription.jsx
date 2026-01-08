import React from "react";
import { View, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";

const CodeforcesDescription = ({ htmlContent }) => {
    const htmlSource = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
            body { font-family: -apple-system, Roboto, sans-serif; padding: 0 10px 40px 10px; font-size: 16px; color: #333; line-height: 1.5; }
            
            /* Codeforces-specific cleanups */
            .header { display: none; } /* Hide duplicate header if present */
            .section-title { font-weight: bold; font-size: 1.1em; margin-top: 20px; margin-bottom: 8px; color: #444; }
            
            /* Input/Output Boxes */
            .input, .output { border: 1px solid #e0e0e0; background: #f9f9f9; padding: 10px; margin: 10px 0; border-radius: 4px; }
            .title { font-weight: bold; font-size: 0.9em; color: #666; margin-bottom: 5px; }
            pre { margin: 0; font-family: monospace; white-space: pre-wrap; word-wrap: break-word; font-size: 14px; }
            
            img { max-width: 100%; height: auto; display: block; margin: 10px auto; }
            
            /* MathJax Loading State */
            .math-loading { text-align: center; color: #888; font-size: 0.9em; margin-top: 20px; }
        </style>
        
        <script>
        window.MathJax = {
            tex: { 
                inlineMath: [['$$$', '$$$'], ['\\\\(', '\\\\)']], 
                displayMath: [['$$$$$$', '$$$$$$'], ['\\\\[', '\\\\]']] 
            },
            svg: { fontCache: 'global' }
        };
        </script>
        <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
      </head>
      <body>
        ${htmlContent || "<p>No content available</p>"}
      </body>
      </html>
    `;

    return (
        <View className="flex-1 bg-white">
            <WebView
                originWhitelist={["*"]}
                source={{ html: htmlSource }}
                style={{ flex: 1, backgroundColor: "transparent" }}
                showsVerticalScrollIndicator={true}
                startInLoadingState={true}
                renderLoading={() => (
                    <ActivityIndicator
                        style={{
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }}
                        size="small"
                    />
                )}
            />
        </View>
    );
};

export default CodeforcesDescription;
