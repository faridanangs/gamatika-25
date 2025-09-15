export async function POST(request) {
  try {
    const { type, data } = await request.json();

    // Kirim ke semua klien melalui stream
    if (global.eventConnections) {
      const message = JSON.stringify({ type, ...data });

      global.eventConnections.forEach((writer) => {
        writer.write(new TextEncoder().encode(`data: ${message}\n\n`));
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to notify' }), {
      status: 500,
    });
  }
}
