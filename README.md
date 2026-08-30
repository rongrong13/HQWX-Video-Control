# 🎥 环球网校视频键盘增强 - UserScript

**一个油猴脚本，为环球网校学习中心视频提供自定义键盘控制，支持快进/快退、连续快退、按住倍速播放，并带有实时操作提示。**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tampermonkey](https://img.shields.io/badge/Tampermonkey-✔-brightgreen)](https://www.tampermonkey.net/)
[![Violentmonkey](https://img.shields.io/badge/Violentmonkey-✔-brightgreen)](https://violentmonkey.github.io/)

---

## ✨ 功能特性

- ⌨️ **键盘控制**
  - **短按左方向键 `←`**：快退 5 秒
  - **短按右方向键 `→`**：快进 5 秒
  - **长按左方向键 `←`（≥200ms）**：持续快退（每 200ms 后退 5 秒），松开停止
  - **长按右方向键 `→`（≥200ms）**：以 **2 倍速** 播放，松开恢复 1 倍速

- 🖥️ **实时操作提示**
  - 短按时显示「⏩ 快进 5s」或「⏪ 快退 5s」，0.8 秒后自动消失
  - 长按时显示「⚡ 2x 加速中」或「⏪ 连续快退」，保持显示直到松开按键
  - 提示样式为居中半透明毛玻璃，不干扰鼠标操作

- 🔄 **完全覆盖原网页快捷键**
  - 屏蔽环球网校自带的方向键功能（原功能体验不佳），杜绝冲突

- ⚙️ **高度可定制**
  - 所有关键参数（步长、长按阈值、倍速、间隔等）均在脚本顶部集中配置，方便修改

---

## 📥 安装

### 方法一：通过油猴（Tampermonkey）直接安装

1. 确保浏览器已安装 [Tampermonkey](https://www.tampermonkey.net/) 或 [Violentmonkey](https://violentmonkey.github.io/)。
2. 点击 **[安装脚本（raw）](https://raw.githubusercontent.com/rongrong13/HQWX-Video-Control/refs/heads/main/HQWX-Video-Control.js)**（请替换为你的 raw 链接）。
3. 油猴会自动识别，点击“安装”即可。

### 方法二：手动创建脚本

1. 打开油猴管理面板，点击“添加新脚本”。
2. 删除默认模板，将 [完整脚本代码](https://raw.githubusercontent.com/rongrong13/HQWX-Video-Control/refs/heads/main/HQWX-Video-Control.js) 复制进去。
3. 保存并刷新环球网校视频页面即可使用。

---

## 🎮 快捷键说明

| 操作 | 效果 | 提示显示 |
| :--- | :--- | :--- |
| **短按 `←`**（<200ms） | 快退 5 秒 | 显示「⏪ 快退 5s」后自动消失 |
| **短按 `→`**（<200ms） | 快进 5 秒 | 显示「⏩ 快进 5s」后自动消失 |
| **长按 `←`**（≥200ms） | 持续快退（每 200ms 退 5 秒） | 持续显示「⏪ 连续快退」直到松开 |
| **长按 `→`**（≥200ms） | 以 2 倍速播放 | 持续显示「⚡ 2x 加速中」直到松开 |

> 💡 **长按判定**：按住按键超过 200ms 即视为长按，松开后恢复 1 倍速（仅右键）。

---

## ⚙️ 配置参数（自定义）

在脚本开头的 `配置` 区域，你可以轻松调整以下参数：

```javascript
const VIDEO_SELECTOR = '#hqwx-palyer > div > div.container.pointer-enabled > video';
const SHORT_PRESS_MS = 200;               // 短按/长按阈值（毫秒）
const SEEK_STEP = 5;                      // 每次快进/快退秒数
const LONG_LEFT_INTERVAL = 200;           // 长按左键连续快退的间隔（毫秒）
const FAST_FORWARD_SPEED = 2;             // 长按右键的倍速值
```

- **`VIDEO_SELECTOR`**：如果你的网站视频选择器不同（如其他网校），请修改为对应的 CSS 选择器。
- **`SHORT_PRESS_MS`**：调整长按灵敏度，数值越小越容易触发长按。
- **`SEEK_STEP`**：每次跳转的秒数，默认为 5 秒。
- **`LONG_LEFT_INTERVAL`**：长按左键时每次后退的间隔，数值越小后退越频繁。
- **`FAST_FORWARD_SPEED`**：长按右键的倍速，可改为 1.5、3 等。

---

## 🧩 兼容性

- ✅ **浏览器**：Chrome / Firefox / Edge / Safari（需支持油猴）
- ✅ **网站**：已测试 `*.hqwx.com` 和 `*.edu24ol.com` 的学习中心视频页面
- ✅ **其他平台**：理论上适用于任何使用 HTML5 `<video>` 标签的页面，只需修改 `VIDEO_SELECTOR` 即可适配

---

## 🐛 已知问题 & 解决方案

- **长按触发不灵敏？**  
  如果觉得长按阈值不合适，可调低 `SHORT_PRESS_MS` 值（如 150）。
- **提示闪烁或显示异常？**  
  确保页面没有其他脚本干扰，或调整 `createIndicator` 中的 CSS 样式。
- **视频选择器失效？**  
  请使用浏览器开发者工具（F12）重新获取视频元素的选择器，并更新 `VIDEO_SELECTOR` 变量。

---

## 🤝 贡献

欢迎提交 Issue 或 Pull Request！  
如果你有更好的功能建议（如自定义提示样式、多语言支持等），请随时参与。

---

## 📄 许可证

本项目采用 [MIT 许可证](./LICENSE)。

---

## 🙋 常见问题

**Q：为什么我按方向键没反应？**  
A：请检查油猴脚本是否已启用，并刷新页面。如果仍无效，打开浏览器控制台（F12）查看是否有 `[键盘增强]` 开头的日志输出。

**Q：如何让脚本在别的网站生效？**  
A：修改脚本开头的 `@match` 规则，并调整 `VIDEO_SELECTOR` 为你目标网站的视频元素选择器。

**Q：提示文字能否改成中文/英文？**  
A：可以直接在 `showIndicator` 和 `showPersistentIndicator` 的调用处修改文本内容。

---

### 📸 效果预览

略

（实际效果以浏览器为准）

---

**Enjoy!** 🎉  
如有任何问题，欢迎在 Issues 中提出。
