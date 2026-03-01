# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- 新增 `AI_PROJECT_CONTEXT.md`，集中沉淀项目目标、用户场景、技术栈约束、架构职责、运行构建命令与 3D 调试入口。
- 新增 `CHANGELOG.md`（Keep a Changelog 风格）作为后续 PR 变更对齐基线。

### Changed
- 重构 `Scene3D` 相机控制：将自动旋转开关与视角预设解耦，避免点击“暂停旋转”时触发相机重置；并将 OrbitControls 扩展到视觉模拟模式，支持拖拽旋转与滚轮缩放。
- 重构 `EyeModel` 解剖模型层次，改为更稳定的巩膜/视网膜/晶状体/角膜结构组合，移除随机血管噪声与额外摇摆动画，提升结构可读性与交互稳定性。
- 更新操作提示文案，明确视觉模拟模式下也支持镜头操作。

### Fixed
- 修复解剖视图中点击“暂停旋转”后模型位置被重置的问题（根因：自动旋转状态变更触发了相机预设重置）。
- 修复视觉模拟模式镜头无法移动的问题（根因：该模式未挂载 OrbitControls）。
