import fs from "fs";

const OPTIONS = {
  C: "c", // The number of bytes
  M: "m", // The number of characters
  W: "w", // The number of words
  L: "l", // The number of lines
};

const processOptions = (options: string) => {
  const processedOptions: string[] = [];
  const allOptions = Object.values(OPTIONS);
  for (let i = 1; i < options.length; i = i + 1) {
    const option = options.charAt(i);
    if (!allOptions.includes(option) || processedOptions.includes(option)) {
      throw new Error(`Incorrect options: ${options}`);
    }
    processedOptions.push(option);
  }
  return processedOptions;
};

const getOptionsAndFilePath = (argv: string[]) => {
  const result: { options: string[]; filePaths: string[] } = {
    options: [],
    filePaths: [],
  };
  if (argv.length < 3) {
    return result;
  }

  if (argv[2].startsWith("-") && argv[2].length < 6) {
    result.options = processOptions(argv[2]);
    result.filePaths = argv.slice(3);
  } else {
    result.filePaths = argv.slice(2);
  }
  return result;
};

const countByte = (fileContent: string) => {
  return Buffer.byteLength(fileContent);
};

const countLines = (fileContent: string) => {
  return fileContent.split("\n").length - 1;
};

const countWords = (fileContent: string) => {
  return fileContent.split(/\s/).filter((word) => word.length > 0).length;
};

const countCharacters = (fileContent: string) => {
  return fileContent.length;
};

const getWC = (filePath: string, options: string[]) => {
  const resolvedFilePath = fs.realpathSync(filePath);
  const fileContent = fs.readFileSync(resolvedFilePath, "utf8");
  const result = [];
  options.forEach((option) => {
    if (option === OPTIONS.C) {
      result.push(countByte(fileContent));
    }
    if (option === OPTIONS.M) {
      result.push(countCharacters(fileContent));
    }
    if (option === OPTIONS.W) {
      result.push(countWords(fileContent));
    }
    if (option === OPTIONS.L) {
      result.push(countLines(fileContent));
    }
  });
  result.push(resolvedFilePath);
  return result;
};

const wc = () => {
  try {
    const { options, filePaths } = getOptionsAndFilePath(process.argv);
    if (filePaths.length === 0) {
      return console.log("No file provided");
    }
    if (options.length === 0) {
      options.push(...Object.values(OPTIONS));
    }

    filePaths.forEach((filePath) => {
      console.log("  ", getWC(filePath, options).join(" "));
    });
  } catch (error) {
    console.log(error.message);
  }
};

wc();
