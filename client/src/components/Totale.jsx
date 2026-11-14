function Totale({ label, value }) {
  return (
    <div className='d-flex justify-content-between gap-4'>
      <dt className='fw-normal'>{label}</dt>
      <dd className='mb-0 text-end'>{value}</dd>
    </div>
  )
}

export default Totale