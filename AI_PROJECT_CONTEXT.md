# AI Project Context

## 项目目标与用户场景

### 项目目标
3D 眼睛视觉模拟器用于帮助用户**直观理解不同屈光状态下的视觉变化**，支持在浏览器中实时调节参数并观察效果。核心目标包括：

- 提供可交互的眼球解剖结构展示（教学/科普向）
- 提供第一人称视觉模糊模拟（体验/对比向）
- 通过统一参数模型（SPH/CYL/AXIS）驱动 UI 与 3D 表现

### 用户场景
- **普通用户/家长**：快速理解近视、远视、散光的视觉差异
- **医疗科普/教育场景**：在课堂或宣教中演示视觉变化
- **产品与研发同学**：验证视觉参数映射是否符合预期，并做迭代优化

## 关键技术栈与版本约束（React / Three / Vite）

> 版本以仓库当前 `package.json` 为准，若升级需先验证 `@react-three/*` 与 React 主版本兼容性。

- **React**: `^18.3.1`
- **react-dom**: `^18.3.1`
- **three**: `^0.183.2`
- **@react-three/fiber**: `^8.15.0`
- **@react-three/drei**: `^9.88.0`
- **Vite**: `^6.0.1`
- **TypeScript**: `~5.6.2`
- **Node 包管理**: `pnpm`

### 版本约束建议
- React 与 `@react-three/fiber` 升级应成对验证，避免渲染上下文异常。
- `@react-three/drei` 升级前需回归验证 Text、OrbitControls、Environment 等高频组件。
- Vite 主版本升级时需检查构建脚本中的缓存清理与类型构建流程是否仍然匹配。

## 核心架构与模块职责

### contexts（状态与业务参数）
- `src/contexts/VisionContext.tsx`
  - 维护视觉参数与交互状态：`sphere`、`cylinder`、`axis`、`viewMode`、`cameraAngle`、`autoRotate`
  - 提供 `useVision()` 统一读写入口，避免组件层级传参复杂化

### 3d（渲染与场景）
- `src/components/3d/Scene3D.tsx`
  - 3D 入口容器，负责 Canvas 初始化、光照、模式切换
  - 在 simulation 模式下启用 `MyopiaFog`（基于 `THREE.Fog` 的模糊模拟）
  - 在 anatomy 模式下挂载 `EyeModel` 与 `OrbitControls`
- `src/components/3d/EyeModel.tsx`
  - 眼球结构与材质表达（解剖展示）
- `src/components/3d/SimulationScene.tsx`
  - 第一人称/环境对象渲染（视力表、建筑、树木等模拟对象）

### ui（参数控制与视图切换）
- `src/components/ui/ControlPanel.tsx`
  - 参数滑块与按钮交互（SPH/CYL/AXIS、视图切换、相机方向、自动旋转）
  - 将用户输入实时同步到 VisionContext

## 运行与构建命令

```bash
# 安装依赖
pnpm install

# 启动开发环境（含预安装兜底）
pnpm dev

# 生产构建（TypeScript + Vite）
pnpm build

# 生产模式构建（带 BUILD_MODE=prod）
pnpm build:prod

# 代码检查
pnpm lint

# 本地预览构建产物
pnpm preview
```

## 常见问题与调试入口（3D 渲染 / 相机 / 雾效）

### 1) 3D 场景空白或模型不显示
优先检查：
- 浏览器控制台是否有 WebGL 上下文报错
- `Scene3D.tsx` 中 `<Canvas>` 是否正常挂载
- 光照是否过暗（可暂时提高 `ambientLight intensity`）
- `viewMode` 是否切换到错误分支导致场景组件未加载

调试入口：
- `src/components/3d/Scene3D.tsx`
- `src/components/3d/EyeModel.tsx`
- `src/components/3d/SimulationScene.tsx`

### 2) 相机视角异常（看不到主体 / 方向错乱）
优先检查：
- `CameraController` 中 `positions` 映射是否符合预期
- `camera.lookAt(0,0,0)` 是否在位置更新后执行
- OrbitControls 的 `minDistance/maxDistance` 是否限制过严
- `camera fov` 是否过大/过小导致观感畸变

调试入口：
- `src/components/3d/Scene3D.tsx`（`CameraController` 与 `Canvas camera`）
- `src/components/ui/ControlPanel.tsx`（视角按钮状态与事件绑定）

### 3) 雾效（近视模糊）不明显或过强
优先检查：
- `MyopiaFog` 中 `total = |sphere| + |cylinder| * 0.5` 的参数映射
- `fog near/far` 计算是否与当前场景尺寸匹配
- 雾颜色与背景色对比不足时视觉不明显
- 模式是否处于 `simulation`（`anatomy` 分支不启用雾效）

调试入口：
- `src/components/3d/Scene3D.tsx`（`MyopiaFog`）
- `src/contexts/VisionContext.tsx`（参数源头）
- `src/components/ui/ControlPanel.tsx`（滑块输入值）

### 4) 参数调节后画面不更新
优先检查：
- 控件事件是否正确调用 `setParams`
- Context Provider 是否包裹在应用入口
- 依赖项是否遗漏，导致 `useMemo/useEffect` 未触发

调试入口：
- `src/contexts/VisionContext.tsx`
- `src/components/ui/ControlPanel.tsx`
- `src/main.tsx`、`src/App.tsx`

## 文档维护约定
- 功能改动先写入 `CHANGELOG.md` 的 `Unreleased`。
- 涉及架构、技术栈、调试流程变化时，同步更新本文件。
