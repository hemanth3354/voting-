import React from 'react'

const loader = () => {
  return (
    <section className='loader'>
        <div className='loader_container'>
            <div className='spinner'>
                <div className='spinner-gear spinner-gear-1'></div>
                <div className='spinner-gear spinner-gear-2'></div>
                <div className='spinner-gear spinner-gear-3'></div>
            </div>
        </div>
    </section>
  )
}

export default loader
