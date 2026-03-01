import { VisionProvider, useVision } from './contexts/VisionContext';
import ControlPanel from './components/ui/ControlPanel';
import Scene3D from './components/3d/Scene3D';
import './App.css';

function AppContent() {
  const { viewMode } = useVision();

  return (
    <div className="app-container">
      {/* 标题栏 */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">
            <span className="title-icon">👁️</span>
            3D眼睛视觉模拟器
          </h1>
          <p className="app-subtitle">
            输入您的视力参数，实时模拟近视/远视/散光的视觉效果
          </p>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="app-main">
        {/* 左侧控制面板 */}
        <aside className="control-panel-container">
          <ControlPanel />
        </aside>

        {/* 右侧3D场景 */}
        <section className="scene-container">
          <Scene3D />

          {/* 视角提示 */}
          <div className="view-indicator">
            {viewMode === 'anatomy' ? (
              <span>🔬 解剖视图 - 观察眼睛结构</span>
            ) : (
              <span>👁️ 视觉模拟 - 您的真实视野</span>
            )}
          </div>

          {/* 操作提示 */}
          <div className="operation-hint">
            {viewMode === 'anatomy' ? (
              <p>拖拽旋转 · 滚轮缩放 · 查看眼睛3D结构</p>
            ) : (
              <p>拖拽旋转 · 滚轮缩放 · 观察不同度数下的视觉模糊效果</p>
            )}
          </div>
        </section>
      </main>

      {/* 页脚 */}
      <footer className="app-footer">
        <p>
          仅供演示参考 · 如有视力问题请咨询专业眼科医生
        </p>
      </footer>
    </div>
  );
}

function App() {
  return (
    <VisionProvider>
      <AppContent />
    </VisionProvider>
  );
}

export default App;
