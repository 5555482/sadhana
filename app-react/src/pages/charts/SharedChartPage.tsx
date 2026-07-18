import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { chartsApi } from '../../api/charts'
import { Spinner } from '../../components/ui/Spinner'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function SharedChartPage() {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError } = useQuery({
    queryKey: ['shared-chart', id],
    queryFn: () => chartsApi.getSharedChart(id!),
  })

  if (isLoading) return <Spinner />
  if (isError || !data) {
    return (
      <div className="flex items-center justify-center h-screen text-error">
        Chart not found
      </div>
    )
  }

  const chartData = (data.entries ?? []).map((e) => ({
    name: e.practice,
    value: e.value ? Object.values(e.value)[0] : 0,
  }))

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card bg-base-100 shadow-sm w-full max-w-lg">
        <div className="card-body gap-3">
          <h1 className="card-title">{data.name}</h1>
          <p className="text-sm text-base-content/50">{data.date_from} – {data.date_to}</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-center text-base-content/40">Made with Sadhana Pro</p>
        </div>
      </div>
    </div>
  )
}
