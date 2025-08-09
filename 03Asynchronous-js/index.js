//https://dog.ceo/api/breed/hound/images/random

const fs = require("fs");
const superagent = require("superagent");

const readFilePro = (file, type) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, type, (err, data) => {
      if (err) reject("could not found");
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject("could not found");
      resolve("successful");
    });
  });
};

// readFilePro(`${__dirname}/dog.txt`, "utf-8")
//   .then((data) => {
//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then((res) => {
//     console.log(res.body.message);

//     return writeFilePro(`${__dirname}/dog-img.txt`, res.body.message);
//   })
//   .then(() => {
//     console.log("random dog image saved");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`, "utf-8");
    console.log(data);
    const res1 = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res2 = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res3 = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const all = await Promise.all([res1, res2, res3]);
    const imgs = all.map((el) => el.body.message);
    console.log(imgs);
    await writeFilePro(`${__dirname}/dog-img.txt`, imgs.join("\n"));
    console.log("random dog image saved");
  } catch (err) {
    console.log(err);
    throw err;
  }
  return "ready";
};

(async () => {
  try {
    console.log("will get dog pic");
    const x = await getDogPic();
    console.log(x);
    console.log("done");
  } catch (err) {
    console.log("error");
  }
})();

// console.log("will get dog pic");
// getDogPic()
//   .then((x) => {
//     console.log(x);
//     console.log("done");
//   })
//   .catch((err) => {
//     console.log("error");
//   });
