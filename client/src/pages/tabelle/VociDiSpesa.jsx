import { useState } from 'react'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import DataTable from '../../components/DataTable.jsx'
import Toolbar from '../../components/Toolbar.jsx'
import { voci } from '../../mocks/voci.js'

const colonne = [{ key: 'nome', label: 'Nome' }]

function VociDiSpesa() {
  const [voceId, setVoceId] = useState(voci[0].id)
  const [sottovoceId, setSottovoceId] = useState(voci[0].sottovoci[0]?.id ?? null)

  const voce = voci.find((v) => v.id === voceId)
  const sottovoce = voce.sottovoci.find((s) => s.id === sottovoceId)

  // Cambiando voce, la selezione delle sottovoci riparte dalla prima
  function selezionaVoce(id) {
    setVoceId(id)
    setSottovoceId(voci.find((v) => v.id === id).sottovoci[0]?.id ?? null)
  }

  return (
    <>
      <h2 className='mb-3'>Voci di spesa</h2>

      <section className='mb-5'>
        <Toolbar label='Azioni voci' />
        <Form key={voceId} className='mb-3' onSubmit={(e) => e.preventDefault()}>
          <Row>
            <Col md={6}>
              <Form.Group controlId='voce'>
                <Form.Label>Voce</Form.Label>
                <Form.Control type='text' defaultValue={voce.nome} />
              </Form.Group>
            </Col>
          </Row>
        </Form>
        <DataTable columns={colonne} rows={voci} selectedId={voceId} onSelect={selezionaVoce} />
      </section>

      <section>
        <h3 className='h5 mb-3'>Sottovoci di {voce.nome}</h3>
        <Toolbar label='Azioni sottovoci' />
        <Form key={`${voceId}-${sottovoceId}`} className='mb-3' onSubmit={(e) => e.preventDefault()}>
          <Row className='g-3'>
            <Col md={6}>
              <Form.Group controlId='sottovoce'>
                <Form.Label>Sottovoce</Form.Label>
                <Form.Control type='text' defaultValue={sottovoce?.nome ?? ''} />
              </Form.Group>
            </Col>
            <Col md={3} className='d-flex align-items-end pb-2'>
              <Form.Check
                id='sottovoce-archiviata'
                type='checkbox'
                label='Archiviata'
                defaultChecked={Boolean(sottovoce?.archiviata)}
              />
            </Col>
          </Row>
        </Form>
        <DataTable
          columns={colonne}
          rows={voce.sottovoci}
          selectedId={sottovoceId}
          onSelect={setSottovoceId}
          rowClassName={(s) => (s.archiviata ? 'row-muted' : undefined)}
        />
      </section>
    </>
  )
}

export default VociDiSpesa