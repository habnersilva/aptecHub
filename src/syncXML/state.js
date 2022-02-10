const fs = require("fs")

const { S3Client, GetObjectCommand, PutObjectCommand, ListObjectsCommand } = require('@aws-sdk/client-s3');

const region = process.env.AWS_REGION;
const Bucket = process.env.AWS_BUCKET_NAME;
const s3 = new S3Client({ region });

async function save(objContentFilesPath, content) {
  await Promise.all(Object.keys(objContentFilesPath).map(async key => {
    const contentFilePath = objContentFilesPath[key]
    await saveOne(contentFilePath, content[key])
  }))
}

async function saveOne(contentFilePath, content) {
  const Body = JSON.stringify(content);
  const putObjectCommand = new PutObjectCommand({
    Bucket,
    Body,
    Key: contentFilePath,
  });
  await s3.send(putObjectCommand);
}

async function getObjectFromS3(Key) {
  return new Promise(async (resolve, reject) => {
    const getObjectCommand = new GetObjectCommand({
      Bucket,
      Key
    })

    const content = await s3.send(getObjectCommand)

    let chunks = [];

    content.Body.once('error', err => reject(err))
    content.Body.on('data', chunk => chunks.push(chunk))
    content.Body.once('end', () => resolve(chunks.join('')))
  })
}

async function load(objContentFilesPath) {
  const listObjectsCommand = new ListObjectsCommand({
    Bucket
  })

  const objects = await s3.send(listObjectsCommand);

  const keys = objects.Contents && objects.Contents.length ? objects.Contents.map(content => content.Key) : [];

  const result = Object.keys(objContentFilesPath).reduce(async (data, key) => {
    const contentFilePath = objContentFilesPath[key]

    if (!keys.includes(contentFilePath)) {
      await saveOne(contentFilePath, {})
    }

    const object = await getObjectFromS3(contentFilePath);

    // const fileBuffer = fs.readFileSync(contentFilePath, "utf-8")
    const contentJson = JSON.parse(object)
    return {
      ...await data,
      [key]: contentJson
    }
  }, {})


  return result
}

module.exports = {
  save,
  load,
}
