const fs = require('fs')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const argv = yargs(hideBin(process.argv))
.option('file', {
  alias: 'file',
  type: 'string',
  description: 'Имя файла лога'
})
.argv

// Проверка что указан файл
const fileName = argv.file
if (!fileName) {
  console.log('не указан файл в параметре --file');
}
else {
  // Чтение предыдущих результатов
  const  readerStream = fs.createReadStream(fileName)
  let data = ''
  readerStream.setEncoding('UTF8').on('data', (chank) => data += chank).on('error', () => data = '')

  // Генерация числа
  const val = Math.floor(Math.random() * 2) + 1

  // Запрос угаданного числа
  readline.question('Введите загаданное число (1 или 2): ', (number) => {
    if (number == val) {
      console.log("Верно")
      data += '+'
    }
    else {
      console.log("Не верно")
      data += '-'
    }
    readline.close();

    // Запись данных в лог
    const writerStream = fs.createWriteStream(fileName)
    writerStream.write(data, 'UTF8')
    writerStream.end()

    // Расчет статистики
    const qtyRight = data.split('+').length - 1
    const qtyAll = data.length

    // Вывод статистики
    console.log(`Всего партий ${qtyAll}. Из них выиграно - ${qtyRight} (${qtyRight/qtyAll*100} %) проиграно - ${qtyAll - qtyRight} (${(qtyAll - qtyRight)/qtyAll*100} %)`)

  });
}
