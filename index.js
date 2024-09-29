const { program } = require('commander');
const fs = require('fs');

program
  .option('-i, --input <path>', 'path to the input file')
  .option('-o, --output <path>', 'path to the source file')
  .option('-d, --display', 'display the result in the console')
  .parse(process.argv);

const options = program.opts();

// Чи вказано вхідний файл?
if (!options.input) {
  console.error("Please, specify the input file");
  process.exit(1);
}

// Чи існує вхідний файл?
if (!fs.existsSync(options.input)) {
  console.error("I can't find the input file");
  process.exit(1);
}

try {
  // Читання даних з файлу
  const data = fs.readFileSync(options.input, 'utf8');
  const jsonData = JSON.parse(data);



  // Фільтрація даних: ku = "13" і value > 5
  const filteredData = jsonData
    .filter(item => item.ku === '13' && typeof item.value === 'number' && item.value > 5)
    .map(item => parseFloat(item.value).toFixed(1)) // Форматування значень до одного знаку після коми
    .join('\n');

  if (filteredData.length === 0) {
    console.log("No matching items were found after filtering.");
  } else {
    // Якщо вказано параметр output -> результат записується у файл
    if (options.output) {
      fs.writeFileSync(options.output, filteredData);
      console.log(`The result is saved to a file: ${options.output}`);
    }

    // Якщо вказано параметр display -> результат виводиться в консоль
    if (options.display) {
      console.log("Result:");
      console.log(filteredData);
    }

    // Якщо не вказано ні output, ні display -> виводимо повідомлення
    if (!options.output && !options.display) {
      console.log('Processing is complete. No parameters are specified for outputting the result.');
    }
  }
} catch (error) {
  console.error('Error while processing a file:', error.message);
  process.exit(1);
}