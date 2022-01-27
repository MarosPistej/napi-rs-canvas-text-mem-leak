import express from "express";
import { Readable } from "stream";
import { createCanvas } from "@napi-rs/canvas";
import { Canvas } from "skia-canvas";

const app = express();
const port = process.env.PORT || 3000;

// Available test cases
const textTest = (ctx, size) => {
  for (let i = 10; i < size - 20; i += 20) {
    for (let j = 25; j < size - 5; j += 20) {
      ctx.fillText("A", i, j);
    }
  }
};

const circleTest = (ctx, size) => {
  for (let i = 10; i < size - 20; i += 20) {
    for (let j = 25; j < size - 5; j += 20) {
      ctx.beginPath();
      ctx.arc(i, j, 5, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }
};

const rectTest = (ctx, size) => {
  for (let i = 10; i < size; i += 20) {
    for (let j = 10; j < size; j += 20) {
      ctx.beginPath();
      ctx.rect(i - 5, j - 5, 10, 10);
      ctx.stroke();
    }
  }
};

const bezierTest = (ctx, size) => {
  for (let i = 10; i < size - 20; i += 20) {
    for (let j = 25; j < size - 5; j += 20) {
      ctx.beginPath();
      ctx.moveTo(i, j);
      ctx.bezierCurveTo(i, j + 5, i + 10, j + 5, i + 10, j);
      ctx.stroke();
    }
  }
};

const lineTest = (ctx, size) => {
  for (let i = 1; i < size; i++) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.stroke();
  }
};

app.get("/canvas/text", async (req, res) => {
  try {
    const canvas = createCanvas(500, 500);
    const ctx = canvas.getContext("2d");

    textTest(ctx, size);
    res.send("ok");
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});
app.get("/canvas/encode", async (req, res) => {
  try {
    let canvas, ctx;
    const size = 500;
    switch (req.query.test) {
      case "arc":
        canvas = createCanvas(size, size);
        ctx = canvas.getContext("2d");
        circleTest(ctx, size);
        break;
      case "bezier":
        canvas = createCanvas(size, size);
        ctx = canvas.getContext("2d");
        bezierTest(ctx, size);
        break;
      case "rect":
        canvas = createCanvas(size, size);
        ctx = canvas.getContext("2d");
        rectTest(ctx, size);
        break;
      default:
        canvas = createCanvas(size, 5000);
        ctx = canvas.getContext("2d");
        lineTest(ctx, size);
        break;
    }

    await canvas.encode("png");
    res.send("ok");
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get("/skia-canvas", async (req, res) => {
  try {
    const canvas = new Canvas(500, 500);
    const ctx = canvas.getContext("2d");

    textTest(ctx, 500);
    res.setHeader("Content-Type", "image/png");
    const pngData = await canvas.toBuffer("png");
    new Readable({
      read() {
        this.push(pngData);
        this.push(null);
      },
    }).pipe(res);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  process.send?.("ready");
});
