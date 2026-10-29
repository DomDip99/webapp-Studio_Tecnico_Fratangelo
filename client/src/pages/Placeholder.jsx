function Placeholder({ title, text = 'Sezione in costruzione.' }) {
  return (
    <>
      <h2>{title}</h2>
      <p className='text-muted'>{text}</p>
    </>
  )
}

export default Placeholder