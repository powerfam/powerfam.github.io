export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 
        className="text-5xl font-bold mb-8"
        style={{ color: 'var(--menu-main)' }}
      >
        About
      </h1>

      <div className="space-y-6 text-lg leading-relaxed">
        <p>
          this is the test "ABOUT" page.
        </p>

        <div 
          className="p-6 rounded-lg border-l-4 my-8"
          style={{
            backgroundColor: 'rgba(130, 102, 68, 0.05)',
            borderColor: 'var(--menu-main)',
          }}
        >
          <p className="font-medium mb-2" style={{ color: 'var(--menu-main)' }}>
            주요 주제
          </p>
          <ul className="space-y-2 ml-4">
            <li>• type1</li>
            <li>• type2</li>
            <li>• type13</li>
          </ul>
        </div>

        <p>
          test sentence
        </p>
      </div>
    </div>
  );
}