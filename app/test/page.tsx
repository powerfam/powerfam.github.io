export default function Test() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">테스트 페이지</h1>
      
      <div className="space-y-4">
        <div 
          className="p-4 rounded-lg border transition-colors"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--menu-main)',
            color: 'var(--foreground)'
          }}
        >
          <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--menu-main)' }}>
            색상 테스트
          </h2>
          <p>라이트모드와 다크모드 전환이 잘 되는지 확인하세요.</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div 
            className="p-4 rounded-lg border transition-colors"
            style={{
              backgroundColor: 'rgba(130, 102, 68, 0.1)',
              borderColor: 'var(--menu-main)',
              color: 'var(--foreground)'
            }}
          >
            <h3 className="font-semibold mb-2" style={{ color: 'var(--menu-main)' }}>
              메인 색상
            </h3>
            <p className="text-sm">메뉴 기본 색상입니다.</p>
          </div>
          
          <div 
            className="p-4 rounded-lg border transition-colors"
            style={{
              backgroundColor: 'rgba(217, 144, 88, 0.1)',
              borderColor: 'var(--menu-sub)',
              color: 'var(--foreground)'
            }}
          >
            <h3 className="font-semibold mb-2" style={{ color: 'var(--menu-sub)' }}>
              서브 색상
            </h3>
            <p className="text-sm">강조 색상입니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}