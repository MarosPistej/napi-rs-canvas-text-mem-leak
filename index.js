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
      ctx.font = "20px Arial";
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
  for (let i = 1; i < size; i += 3) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(size, i);
    ctx.stroke();
  }
};

const size = 500;
const currentTest = textTest; // REPLACE `textTest` WITH DESIRED TEST, default `textTest`

app.get("/canvas", async (req, res) => {
  try {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext("2d");

    currentTest(ctx, size);

    res.setHeader("Content-Type", "image/png");

    const pngData = await canvas.encode("png");
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

app.get("/skia-canvas", async (req, res) => {
  try {
    const canvas = new Canvas(size, size);
    const ctx = canvas.getContext("2d");

    currentTest(ctx, size);

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
