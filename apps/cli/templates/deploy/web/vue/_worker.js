export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Serve static assets
    try {
      // Check if the path has a file extension
      const hasExtension = url.pathname.split('/').pop().includes('.');
      
      if (hasExtension) {
        // Try to serve the static asset
        return await env.ASSETS.fetch(request);
      }
      
      // For paths without extensions, serve index.html (SPA routing)
      const indexRequest = new Request(new URL('/index.html', request.url).toString(), request);
      return await env.ASSETS.fetch(indexRequest);
    } catch (e) {
      // If the asset doesn't exist, serve index.html
      const indexRequest = new Request(new URL('/index.html', request.url).toString(), request);
      return await env.ASSETS.fetch(indexRequest);
    }
  },
};