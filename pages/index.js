import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'
import Navbar from '@components/Navbar'
import Map from '@components/Map'



export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>bad landlords</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Navbar />
        <Header title="Bad Landlords" />
        <p className="description">
          Bad landlords in Boston Map
        </p>
        <Map />
        
      </main>

      <Footer />
    </div>
  )
}
