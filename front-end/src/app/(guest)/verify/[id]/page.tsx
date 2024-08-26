import Verify from '@/components/auth/verify'
import React from 'react'

const VerifyPage = ({ params }: { params: { id: string } }) => {
    const { id } = params // get id from server-side. if code antd => toang
    // create a client file
    return (
        <Verify id={id} />
    )
}

export default VerifyPage