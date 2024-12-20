let start = 1;
connection = new WebSocket(url);

connection.onopen = () => {
    connection.send(JSON.stringify(data))
  console.log("Connected to the server");


  connection.onerror = (error) => {
    console.error("WebSocket Error:", error);
    connect();
  };  

  connection.onclose = (event) => {
    console.warn(
      "WebSocket connection closed:",
      event.code,
      event.reason
    );
    connect();
  };

  connection.onmessage = (e) => {
    if (start) {
      start = 0;
      e.data.arrayBuffer().then((data) => {
        res = new Uint8Array(data);

        let a = 0;
        for (let i = 0; i < canvas.width * canvas.height * 4; i++) {
          if (i % 4 == 3) {
            img[i] = 255;
            continue;
          }
          img[i] = res[a];
          a++;
        }
        draw();
      });
    } else {
      e.data.arrayBuffer().then((res) => {
        let b = new Uint8Array(res);
        let a = readNBits(b, 0, bitcanva);
        // console.log(a)

        // console.log(b.length)
        drawPx(
          a,
          readNBits(b, bitcanva, 8),
          readNBits(b, bitcanva + 8, 8),
          readNBits(b, bitcanva + 16, 8)
        );
      });
    }
  };
};
}