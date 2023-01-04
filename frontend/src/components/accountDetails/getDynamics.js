import Chart from 'chart.js/auto'
import { getWindowWidth } from '../../utils/getWindowWidth'
import { createPlaceholder } from '../placeholder'

export function getDynamics(data) {
  const months = [
    'январь',
    'февраль',
    'март',
    'апрель',
    'май',
    'июнь',
    'июль',
    'август',
    'сентябрь',
    'октябрь',
    'ноябрь',
    'декабрь',
  ]
  if (data.transactions.length !== 0) {
    const ctx = document.getElementById('dynamics').getContext('2d')
    const { legend, dynamicsPerMonth, maxValue } = getConnectData(data)
    const chartAreaBorder = {
      id: 'chartAreaBorder',
      beforeDraw(chart, args, options) {
        const {
          ctx,
          chartArea: { left, top, width, height },
        } = chart
        ctx.save()
        ctx.strokeStyle = options.borderColor
        ctx.lineWidth = options.borderWidth
        ctx.setLineDash(options.borderDash || [])
        ctx.lineDashOffset = options.borderDashOffset
        ctx.strokeRect(left, top, width, height)
        ctx.restore()
      },
    }
    // eslint-disable-next-line no-unused-vars
    const myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: legend.map((el) => months[el].slice(0, 3)),
        datasets: [
          {
            label: { hidden: true },
            data: dynamicsPerMonth,
            backgroundColor: '#116ACC',
            borderWidth: 1,
          },
        ],
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          y: {
            stacked: true,
            beginAtZero: true,
            position: 'right',
            max: maxValue,
            min: 0,
            display: true,
            grid: {
              display: 'false',
            },
            ticks: {
              align: 'center',
              maxTicksLimit: 2,
              callback: (value) => `${value} ₽`,
              padding: 5,
              color: '#000',
              font: {
                size: () => {
                  if (getWindowWidth() <= 550) {
                    return 10
                  } else {
                    return 20
                  }
                },
                style: 'normal',
                weight: '500',
                lineHeight: 1.2,
              },
            },
          },
          x: {
            display: true,
            grid: {
              display: false,
            },
            ticks: {
              padding: 0,
              color: '#000',
              font: {
                size: () => {
                  if (getWindowWidth() <= 550) {
                    return 10
                  } else {
                    return 20
                  }
                },
                style: 'normal',
                weight: '500',
                lineHeight: 1.2,
              },
            },
          },
        },
        responsive: true,
        plugins: {
          legend: false,
          tooltip: false,
          chartAreaBorder: {
            borderColor: 'black',
            borderWidth: 1,
          },
        },
      },
      plugins: [chartAreaBorder],
    })

    // eslint-disable-next-line no-inner-declarations
    function getConnectData(data) {
      let transactions = data.transactions
      const owner = data.account
      const balanceDict = {}

      for (let i = transactions.length - 1; i >= 0; i--) {
        const month = new Date(transactions[i].date).getMonth()
        const year = new Date(transactions[i].date).getFullYear()
        let income = 0
        let costs = 0
        income +=
          owner === transactions[i].from ? Math.abs(transactions[i].amount) : 0
        costs +=
          owner === transactions[i].from ? 0 : Math.abs(transactions[i].amount)

        if (balanceDict[year]) {
          if (balanceDict[year][month]) {
            balanceDict[year][month]['to'] += income
            balanceDict[year][month]['from'] += costs
          } else {
            balanceDict[year][month] = { to: income, from: costs }
          }
        } else {
          balanceDict[year] = {}
          balanceDict[year][month] = {}
          balanceDict[year][month] = { to: income, from: costs }
        }
      }

      const currentYear = new Date().getFullYear()
      const currentMonth = new Date().getMonth()

      let legend = Object.entries(balanceDict[currentYear])
        .filter((el) => {
          if (el[0] <= currentMonth) {
            return el[0]
          } else {
            return el[0]
          }
        })
        .sort((a, b) => a - b)
        .map((el) => el[0])

      let dynamicsPerMonth = Object.entries(balanceDict[currentYear])
        .filter((el) => {
          if (el[0] <= currentMonth) {
            return el[0]
          } else {
            return el[0]
          }
        })
        .sort((a, b) => a - b)
        .map((el) => el[1].to + el[1].from)
        .map((el) => Math.floor(el))

      const maxValue = Math.max(...dynamicsPerMonth)
      return {
        legend,
        dynamicsPerMonth,
        maxValue,
      }
    }
  } else {
    const placeholder = createPlaceholder(
      'Здесь будет отображена динамика баланса...'
    )
    const dynamicsWrap = document.querySelector('.dynamics-wrap')
    dynamicsWrap.prepend(placeholder)
  }
}

// export default Chart
