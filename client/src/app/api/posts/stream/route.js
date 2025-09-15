export async function GET() {
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  // Simpan koneksi aktif
  if (!global.eventConnections) {
    global.eventConnections = new Set();
  }
  global.eventConnections.add(writer);

  // Kirim pesan saat koneksi dibuka
  writer.write(new TextEncoder().encode('data: connected\n\n'));

  // Handle koneksi tertutup
  const closeHandler = () => {
    global.eventConnections.delete(writer);
    writer.close();
  };

  // Cleanup
  req.on('close', closeHandler);

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}

export async function POST(request) {
  try {
    const { type, data } = await request.json();

    // Broadcast ke semua klien terhubung
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
    return new Response(JSON.stringify({ error: 'Failed to broadcast' }), {
      status: 500,
    });
  }
}
