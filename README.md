---
AIGC:
    ContentProducer: Minimax Agent AI
    ContentPropagator: Minimax Agent AI
    Label: AIGC
    ProduceID: "00000000000000000000000000000000"
    PropagateID: "00000000000000000000000000000000"
---

# 3D 眼睛视觉模拟器 (Vision Simulator)

一个基于 WebGL 的 3D 眼睛视觉模拟网站，可以实时模拟近视/远视/散光的视觉效果。

## 项目简介

用户可以通过调节视力参数（球镜度数、柱镜度数、轴向），实时观察不同度数下的视觉效果。主要功能包括：

- **解剖视图**：观察 3D 眼睛结构（角膜、虹膜、晶状体、巩膜、血管等）
- **视觉模拟**：第一人称视角模拟近视/散光的模糊效果
- **参数调节**：通过滑块调节球镜(SPH)、柱镜(CYL)、轴向(AXIS)

## 技术栈

- **React 18** + **TypeScript** + **Vite**
- **@react-three/fiber** (v8.18.0) - React 的 Three.js 渲染
- **@react-three/drei** (v9.122.0) - 常用 Three.js 组件
- **Tailwind CSS** - 样式
- **Radix UI** - UI 组件库
- **pnpm** - 包管理器

## 启动项目

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建生产版本
pnpm build
```

## 项目结构

```
src/
├── App.tsx                    # 主应用组件
├── contexts/
│   └── VisionContext.tsx      # 视力参数状态管理
├── components/
│   ├── 3d/
│   │   ├── Scene3D.tsx        # 3D 场景主组件
│   │   ├── EyeModel.tsx       # 3D 眼睛模型
│   │   └── SimulationScene.tsx # 视觉模拟场景
│   ├── ui/
│   │   └── ControlPanel.tsx   # 参数控制面板
│   └── ErrorBoundary.tsx      # 错误边界
├── hooks/
│   └── use-mobile.tsx         # 移动端检测
└── lib/
    └── utils.ts               # 工具函数
```

## 开发记录

### 2026年 开发过程

1. **版本兼容性修复**
   - 初始使用 @react-three/fiber v9.x 与 React 18.3.1 不兼容，报错 `Cannot read properties of undefined (reading 'S')`
   - 降级到 @react-three/fiber v8.18.0, @react-three/drei v9.122.0, @react-three/postprocessing v2.19.1
   - 后续移除了 postprocessing（因兼容性问题）

2. **Sparkles 组件问题**
   - @react-three/drei 的 Sparkles 组件在 v9.x 有兼容问题
   - 使用自定义 points 粒子替代

3. **眼睛模型重构**
   - 原始版本各组件位置分散
   - 重构为半透明结构：内部结构（血管、虹膜、瞳孔）在前，外部（巩膜、角膜）在后
   - 角膜使用 hemisphere geometry 覆盖眼球前方

4. **模糊效果**
   - 使用 THREE.Fog 雾效模拟近视模糊
   - 后因兼容性问题移除了 DepthOfField

### 待完成

- 眼睛模型细节优化（角膜形状、半透明效果）
- 散光轴向模糊效果（目前只实现基础模糊）
- 后处理效果重新添加（需要调整版本或使用自定义着色器）

## 已知问题

1. 角膜 3D 形状显示不够自然
2. 视觉模拟视角可调整（FOV 和相机位置）
3. postprocessing 效果暂未启用

## 相关文档

- [CLAUDE.md](./CLAUDE.md) - Claude Code 使用指南
- [AI_PROJECT_CONTEXT.md](./AI_PROJECT_CONTEXT.md) - AI 协作项目上下文（目标、架构、运行与调试）
- [CHANGELOG.md](./CHANGELOG.md) - 变更日志（Keep a Changelog）
