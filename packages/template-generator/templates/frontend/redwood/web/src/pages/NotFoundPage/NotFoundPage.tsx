export default () => (
  <main>
    <style
      dangerouslySetInnerHTML={{
        __html: `
          html, body {
            margin: 0;
          }
          html * {
            box-sizing: border-box;
          }
          main {
            display: flex;
            align-items: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
            text-align: center;
            background-color: #0f172a;
            color: #f8fafc;
            height: 100vh;
          }
          section {
            background-color: #1e293b;
            border-radius: 0.25rem;
            width: 32rem;
            padding: 1rem;
            margin: 0 auto;
            box-shadow: 0 1px 3px rgba(0,0,0,0.5);
          }
          h1 {
            font-size: 2rem;
            margin: 0;
            font-weight: 500;
            line-height: 1;
            color: #38bdf8;
          }
        `,
      }}
    />
    <section>
      <h1>
        <span>404 Page Not Found</span>
      </h1>
    </section>
  </main>
);
