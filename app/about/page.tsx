export default function About() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">About</h1>
      
      <div className="space-y-4">
        <p className="text-lg">
          안녕하세요, Voti입니다.
        </p>
        
        <p>
          이 블로그는 Next.js 14 + TypeScript + Tailwind CSS로 제작되었습니다.
        </p>
        
        <div className="border-l-4 border-[#826644] pl-4 py-2">
          <p className="italic">
            "좋은 글을 통해 생각을 나누는 공간"
          </p>
        </div>
      </div>
    </div>
  );
}