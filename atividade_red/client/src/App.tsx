import { Card, Row, Col, Table } from 'antd'

function App() {
  const dataSource = [
      {
        _id: "573a1390f29313caabcd413b",
        title: "The Arrival of a Train",
        year: 1896,
        runtime: 1,
        poster: "http://ia.media-imdb.com/images/M/MV5BMjEyNDk5MDYzOV5BMl5BanBnXkFtZTgwNjIxMTEwMzE@._V1_SX300.jpg",
        cast: [
          "Madeleine Koehler"
        ],
        genres: [
          "Documentary",
          "Short"
        ],
      }, 
      {
        _id: "612aafcf35e8f400075e66d2",
        title: "Shrek terceiro",
        year: 2007,
        poster: "https://upload.wikimedia.org/wikipedia/pt/c/c2/Shrek_the_Third_Poster.jpg",
        cast: [
          "Mike Myers", "Cameron Diaz", "Antonio Banderas", "Justin Timberlake", "Eddie Murphy", "Julie Andrews", "John Cleese", "Rupert Everett", "Eric Idle"
        ],
        genres: [
          "Comedy",
          "Fantasy"
        ],
      }
  ];

  const columns = [
    {
      title: 'Poster',
      dataIndex: 'poster',
      key: 'poster',
      render: (record: any, teste: any, teste2: any) => {
        console.log('record',record)
        console.log('teste', teste)
        console.log('teste2', teste2)
        return <img></img>
      }
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Release year',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
  ];

  return (
    <Card>
      <Row>
        <Table
          title={() => 'Filmes'} 
          size="small" 
          columns={columns}
          dataSource={dataSource} 
          pagination={dataSource.length > 10 ? true : false} 
        />
      </Row>
      <Row>
        <img src="https://upload.wikimedia.org/wikipedia/pt/c/c2/Shrek_the_Third_Poster.jpg" alt='aaa'/>
      </Row>
    </Card>
  )
}

export default App
