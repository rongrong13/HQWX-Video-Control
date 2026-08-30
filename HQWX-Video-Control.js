// ==UserScript==
// @name         HQWX Video Control
// @name:zh-CN   环球网校网课按键增强
// @namespace   https://github.com/rongrong13/HQWX-Video-Control
// @version      3.0
// @description  方向键控制视频：±5s、连续快退、2倍速，并显示操作提示
// @author       rongrong13
// @match        *://*.hqwx.com/*
// @match        *://*.edu24ol.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // ---------- 配置 ----------
    const VIDEO_SELECTOR = '#hqwx-palyer > div > div.container.pointer-enabled > video';
    const SHORT_PRESS_MS = 200;               // 判定长按的阈值（毫秒）
    const SEEK_STEP = 5;                      // 每次跳转秒数
    const LONG_LEFT_INTERVAL = 200;           // 长按左键连续快退间隔（毫秒）
    const FAST_FORWARD_SPEED = 2;             // 长按右键的倍速

    // ---------- 创建速度指示器 ----------
    let indicatorTimer = null;
    let indicatorHideTimeout = null;

    function createIndicator() {
        const div = document.createElement('div');
        div.id = 'custom-video-indicator';
        div.style.cssText = `
            position: fixed;
            top: 30px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 24px;
            border-radius: 12px;
            background: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            color: #fff;
            font-size: 18px;
            font-weight: 600;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            z-index: 9999999;
            display: none;
            opacity: 0;
            transition: opacity 0.2s ease;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            pointer-events: none;
            letter-spacing: 0.5px;
            white-space: nowrap;
        `;
        document.body.appendChild(div);
        return div;
    }

    const indicator = createIndicator();

    function showIndicator(text, duration = null) {
        // 清除之前的隐藏定时器
        if (indicatorHideTimeout) {
            clearTimeout(indicatorHideTimeout);
            indicatorHideTimeout = null;
        }
        // 更新文本
        indicator.textContent = text;
        indicator.style.display = 'block';
        // 强制重绘以触发过渡
        void indicator.offsetWidth;
        indicator.style.opacity = '1';

        // 如果指定了持续时间（短按用），自动隐藏
        if (duration !== null) {
            indicatorHideTimeout = setTimeout(() => {
                hideIndicator();
            }, duration);
        }
    }

    function hideIndicator() {
        indicator.style.opacity = '0';
        // 等待过渡结束后隐藏
        setTimeout(() => {
            indicator.style.display = 'none';
        }, 200);
        if (indicatorHideTimeout) {
            clearTimeout(indicatorHideTimeout);
            indicatorHideTimeout = null;
        }
    }

    // 长按时显示持续提示（不自动消失）
    function showPersistentIndicator(text) {
        // 清除自动隐藏定时器
        if (indicatorHideTimeout) {
            clearTimeout(indicatorHideTimeout);
            indicatorHideTimeout = null;
        }
        showIndicator(text, null); // 不自动消失
    }

    // ---------- 获取视频 ----------
    function getVideo() {
        return document.querySelector(VIDEO_SELECTOR);
    }

    // ---------- 状态管理 ----------
    const state = {
        right: {
            isDown: false,
            keydownTime: 0,
            pollingTimer: null,
            longPressTriggered: false,
        },
        left: {
            isDown: false,
            keydownTime: 0,
            pollingTimer: null,
            longPressTriggered: false,
            continuousSeekTimer: null,
        }
    };

    // ---------- 停止左键连续快退 ----------
    function stopLeftContinuous() {
        if (state.left.continuousSeekTimer) {
            clearInterval(state.left.continuousSeekTimer);
            state.left.continuousSeekTimer = null;
        }
    }

    // ---------- 轮询检查 ----------
    function startPolling(key) {
        const s = state[key];
        if (s.pollingTimer) return;

        s.pollingTimer = setInterval(() => {
            if (!s.isDown) {
                clearInterval(s.pollingTimer);
                s.pollingTimer = null;
                return;
            }

            const elapsed = Date.now() - s.keydownTime;
            if (elapsed >= SHORT_PRESS_MS && !s.longPressTriggered) {
                s.longPressTriggered = true;
                const video = getVideo();
                if (!video) return;

                if (key === 'right') {
                    // 长按右键 → 2倍速，显示提示
                    video.playbackRate = FAST_FORWARD_SPEED;
                    showPersistentIndicator(`⚡ ${FAST_FORWARD_SPEED}x 加速中`);
                } else if (key === 'left') {
                    // 长按左键 → 连续快退
                    stopLeftContinuous();
                    state.left.continuousSeekTimer = setInterval(() => {
                        const v = getVideo();
                        if (v) {
                            v.currentTime = Math.max(0, v.currentTime - SEEK_STEP);
                        }
                    }, LONG_LEFT_INTERVAL);
                    showPersistentIndicator(`⏪ 连续快退`);
                }
            }
        }, 50);
    }

    function stopPolling(key) {
        const s = state[key];
        if (s.pollingTimer) {
            clearInterval(s.pollingTimer);
            s.pollingTimer = null;
        }
    }

    // ---------- 键盘事件 ----------
    function handleKeyDown(e) {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        e.preventDefault();
        e.stopPropagation();

        const key = e.key === 'ArrowRight' ? 'right' : 'left';
        const s = state[key];

        if (s.isDown) return;

        s.isDown = true;
        s.keydownTime = Date.now();
        s.longPressTriggered = false;

        startPolling(key);
    }

    function handleKeyUp(e) {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        e.preventDefault();
        e.stopPropagation();

        const key = e.key === 'ArrowRight' ? 'right' : 'left';
        const s = state[key];

        if (!s.isDown) return;

        stopPolling(key);

        const video = getVideo();
        if (!video) {
            s.isDown = false;
            return;
        }

        if (key === 'right') {
            if (s.longPressTriggered) {
                video.playbackRate = 1;
                hideIndicator(); // 松开后隐藏
            } else {
                // 短按 → 快进5s
                video.currentTime = Math.min(video.duration, video.currentTime + SEEK_STEP);
                showIndicator(`⏩ 快进 ${SEEK_STEP}s`, 800);
            }
        } else if (key === 'left') {
            stopLeftContinuous();
            if (s.longPressTriggered) {
                hideIndicator(); // 松开后隐藏
            } else {
                video.currentTime = Math.max(0, video.currentTime - SEEK_STEP);
                showIndicator(`⏪ 快退 ${SEEK_STEP}s`, 800);
            }
        }

        s.isDown = false;
        s.longPressTriggered = false;
    }

    // ---------- 绑定事件 ----------
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keyup', handleKeyUp, true);

    console.log('[键盘增强] 带提示版已启动！');
    console.log('[键盘增强] 短按←/→：±5s（提示显示0.8秒）');
    console.log('[键盘增强] 长按←：连续快退（提示持续显示）');
    console.log('[键盘增强] 长按→：2倍速（提示持续显示，松开恢复）');
})();
