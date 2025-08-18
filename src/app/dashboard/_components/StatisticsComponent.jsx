"use client"

import * as React from "react"
import { CalendarIcon, Info } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const chartData = [
  { date: "2024-04-01", client: 222, products: 150 },
  { date: "2024-04-02", client: 97, products: 180 },
  { date: "2024-04-03", client: 167, products: 120 },
  { date: "2024-04-04", client: 242, products: 260 },
  { date: "2024-04-05", client: 373, products: 290 },
  { date: "2024-04-06", client: 301, products: 340 },
  { date: "2024-04-07", client: 245, products: 180 },
  { date: "2024-04-08", client: 409, products: 320 },
  { date: "2024-04-09", client: 59, products: 110 },
  { date: "2024-04-10", client: 261, products: 190 },
  { date: "2024-04-11", client: 327, products: 350 },
  { date: "2024-04-12", client: 292, products: 210 },
  { date: "2024-04-13", client: 342, products: 380 },
  { date: "2024-04-14", client: 137, products: 220 },
  { date: "2024-04-15", client: 120, products: 170 },
  { date: "2024-04-16", client: 138, products: 190 },
  { date: "2024-04-17", client: 446, products: 360 },
  { date: "2024-04-18", client: 364, products: 410 },
  { date: "2024-04-19", client: 243, products: 180 },
  { date: "2024-04-20", client: 89, products: 150 },
  { date: "2024-04-21", client: 137, products: 200 },
  { date: "2024-04-22", client: 224, products: 170 },
  { date: "2024-04-23", client: 138, products: 230 },
  { date: "2024-04-24", client: 387, products: 290 },
  { date: "2024-04-25", client: 215, products: 250 },
  { date: "2024-04-26", client: 75, products: 130 },
  { date: "2024-04-27", client: 383, products: 420 },
  { date: "2024-04-28", client: 122, products: 180 },
  { date: "2024-04-29", client: 315, products: 240 },
  { date: "2024-04-30", client: 454, products: 380 },
  { date: "2024-05-01", client: 165, products: 220 },
  { date: "2024-05-02", client: 293, products: 310 },
  { date: "2024-05-03", client: 247, products: 190 },
  { date: "2024-05-04", client: 385, products: 420 },
  { date: "2024-05-05", client: 481, products: 390 },
  { date: "2024-05-06", client: 498, products: 520 },
  { date: "2024-05-07", client: 388, products: 300 },
  { date: "2024-05-08", client: 149, products: 210 },
  { date: "2024-05-09", client: 227, products: 180 },
  { date: "2024-05-10", client: 293, products: 330 },
  { date: "2024-05-11", client: 335, products: 270 },
  { date: "2024-05-12", client: 197, products: 240 },
  { date: "2024-05-13", client: 197, products: 160 },
  { date: "2024-05-14", client: 448, products: 490 },
  { date: "2024-05-15", client: 473, products: 380 },
  { date: "2024-05-16", client: 338, products: 400 },
  { date: "2024-05-17", client: 499, products: 420 },
  { date: "2024-05-18", client: 315, products: 350 },
  { date: "2024-05-19", client: 235, products: 180 },
  { date: "2024-05-20", client: 177, products: 230 },
  { date: "2024-05-21", client: 82, products: 140 },
  { date: "2024-05-22", client: 81, products: 120 },
  { date: "2024-05-23", client: 252, products: 290 },
  { date: "2024-05-24", client: 294, products: 220 },
  { date: "2024-05-25", client: 201, products: 250 },
  { date: "2024-05-26", client: 213, products: 170 },
  { date: "2024-05-27", client: 420, products: 460 },
  { date: "2024-05-28", client: 233, products: 190 },
  { date: "2024-05-29", client: 78, products: 130 },
  { date: "2024-05-30", client: 340, products: 280 },
  { date: "2024-05-31", client: 178, products: 230 },
  { date: "2024-06-01", client: 178, products: 200 },
  { date: "2024-06-02", client: 470, products: 410 },
  { date: "2024-06-03", client: 103, products: 160 },
  { date: "2024-06-04", client: 439, products: 380 },
  { date: "2024-06-05", client: 88, products: 140 },
  { date: "2024-06-06", client: 294, products: 250 },
  { date: "2024-06-07", client: 323, products: 370 },
  { date: "2024-06-08", client: 385, products: 320 },
  { date: "2024-06-09", client: 438, products: 480 },
  { date: "2024-06-10", client: 155, products: 200 },
  { date: "2024-06-11", client: 92, products: 150 },
  { date: "2024-06-12", client: 492, products: 420 },
  { date: "2024-06-13", client: 81, products: 130 },
  { date: "2024-06-14", client: 426, products: 380 },
  { date: "2024-06-15", client: 307, products: 350 },
  { date: "2024-06-16", client: 371, products: 310 },
  { date: "2024-06-17", client: 475, products: 520 },
  { date: "2024-06-18", client: 107, products: 170 },
  { date: "2024-06-19", client: 341, products: 290 },
  { date: "2024-06-20", client: 408, products: 450 },
  { date: "2024-06-21", client: 169, products: 210 },
  { date: "2024-06-22", client: 317, products: 270 },
  { date: "2024-06-23", client: 480, products: 530 },
  { date: "2024-06-24", client: 132, products: 180 },
  { date: "2024-06-25", client: 141, products: 190 },
  { date: "2024-06-26", client: 434, products: 380 },
  { date: "2024-06-27", client: 448, products: 490 },
  { date: "2024-06-28", client: 149, products: 200 },
  { date: "2024-06-29", client: 103, products: 160 },
  { date: "2024-06-30", client: 446, products: 400 },
]

const chartConfig = {
  client: {
    label: "Клиенты",
    color: "var(--chart-1)",
  },
  products: {
    label: "Товары",
    color: "var(--chart-2)",
  },
}

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d")
  const [dateRange, setDateRange] = React.useState({
    from: new Date(2024, 3, 1), // April 1, 2024
    to: new Date(2024, 5, 30),   // June 30, 2024
  })

  // Handle quick time range selection
  const handleTimeRangeChange = (value) => {
    setTimeRange(value)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90

    switch (value) {
      case "1d":
        daysToSubtract = 1
        break
      case "7d":
        daysToSubtract = 7
        break
      case "30d":
        daysToSubtract = 30
        break
      case "90d":
        daysToSubtract = 90
        break
      default:
        daysToSubtract = 90
    }

    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)

    setDateRange({
      from: startDate,
      to: referenceDate
    })
  }

  const filteredData = React.useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return chartData

    return chartData.filter((item) => {
      const date = new Date(item.date)
      return date >= dateRange.from && date <= dateRange.to
    })
  }, [dateRange])

  // Calculate totals for table
  const totals = React.useMemo(() => {
    return filteredData.reduce(
      (acc, item) => ({
        client: acc.client + item.client,
        products: acc.products + item.products,
      }),
      { client: 0, products: 0 }
    )
  }, [filteredData])

  return (
    <div className="w-11/12 mx-auto space-y-6">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Сделки</h2>
          <p className="text-muted-foreground">
            Прошлый месяц
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick time range selector */}
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Период" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1d">Сегодня</SelectItem>
              <SelectItem value="7d">1 неделя</SelectItem>
              <SelectItem value="30d">1 месяц</SelectItem>
              <SelectItem value="90d">3 месяца</SelectItem>
            </SelectContent>
          </Select>

          {/* Date range picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant="outline"
                className="w-[280px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd LLL", { locale: ru })} -{" "}
                      {format(dateRange.to, "dd LLL, y", { locale: ru })}
                    </>
                  ) : (
                    format(dateRange.from, "dd LLL, y", { locale: ru })
                  )
                ) : (
                  <span>Выберите даты</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader className={"hidden"}>
          <CardTitle>Area Chart - Gradient</CardTitle>
          <CardDescription>
            Показаны общие показатели за выбранный период
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            className="aspect-auto h-[300px] w-full"
            config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={filteredData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("ru-RU", {
                    day: "numeric",
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("ru-RU", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })
                    }}
                  />
                }
              />
              <defs>
                <linearGradient className="z-10" id="fillProducts" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--white)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="0%"
                    stopColor="var(--white)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillClient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--primary)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--primary)"
                    stopOpacity={0.1}
                  />
                </linearGradient>

              </defs>
              <Area
                dataKey="products"
                type="natural"
                fill="url(#fillProducts)"
                fillOpacity={0.4}
                stroke="#2A2C3821"
                strokeWidth={3}
                stackId="b"
              />
              <Area
                dataKey="client"
                type="natural"
                fill="url(#fillClient)"
                fillOpacity={0.4}
                stroke="#7f8084"
                strokeWidth={2}
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Summary Table - Bottom */}
      <div className="w-2/4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-6 ring-[#7f8084]">
        {/* Clients */}
        <div className="space-y-4">
          <div className="flex gap-2 justify-start items-center">
            <h3 className="text-lg font-medium flex items-center gap-2">
              Клиенты
            </h3>
            <Info className="text-[#7f8084]" />
          </div>
          <div className="space-y-5">
            <div className="flex flex-col items-start justify-start">
              <div className="flex items-center gap-3">
                <div className="w-6 h-1 bg-[#7f8084] rounded"></div>
                <span className="text-sm text-[#D0D1D2]">Сделка 1</span>
              </div>
              <span className="ml-9 font-mono text-sm font-medium">
                {Math.floor(totals.client * 0.4).toLocaleString()} клиентов
              </span>
            </div>

            <div className="flex flex-col items-start justify-start">
              <div className="flex items-center gap-3">
                <div className="w-6 h-1 bg-[#7f8084] rounded"></div>
                <span className="text-sm text-[#D0D1D2]">Сделка 2</span>
              </div>
              <span className="ml-9 font-mono text-sm font-medium">
                {Math.floor(totals.client * 0.4).toLocaleString()} клиентов
              </span>
            </div>

            <div className="">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-[#D0D1D2]">Другие сделки</span>
                <span className="font-mono text-sm font-medium">
                  {Math.floor(totals.client * 0.3).toLocaleString()} клиентов
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="space-y-4">
          <div className="flex gap-2 justify-start items-center">
            <h3 className="text-lg font-medium flex items-center gap-2">
              Товары
            </h3>
            <Info className="text-[#7f8084]" />
          </div>

          <div className="space-y-5">
            <div className="flex flex-col items-start justify-start">
              <div className="flex items-center gap-3">
                <div className="w-6 h-1 bg-[#7f8084] rounded"></div>
                <span className="text-sm text-[#D0D1D2]">Товар 1</span>
              </div>
              <span className="ml-9 font-mono text-sm font-medium">
                {Math.floor(totals.products * 0.4).toLocaleString()} товаров
              </span>
            </div>

            <div className="flex flex-col items-start justify-start">
              <div className="flex items-center gap-3">
                <div className="w-6 h-1 bg-[#7f8084] rounded"></div>
                <span className="text-sm text-[#D0D1D2]">Товар 2</span>
              </div>
              <span className="ml-9 font-mono text-sm font-medium">
                {Math.floor(totals.products * 0.4).toLocaleString()} товаров
              </span>
            </div>

            <div className="">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-[#D0D1D2]">Другие товары</span>
                <span className="font-mono text-sm font-medium">
                  {Math.floor(totals.products * 0.3).toLocaleString()} товаров
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}