import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { accommodationService } from '../../api/axiosConfig'
import AccommodationForm from './AccommodationForm'
import { PageLoader } from '../../components/common/Loaders'

export default function EditAccommodation() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    accommodationService.getById(id).then(res => setData(res.data)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <PageLoader />
  return <AccommodationForm editId={id} initialData={data} />
}
