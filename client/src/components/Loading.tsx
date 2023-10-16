import React from 'react'
import {
    Grid,
    Loader
} from 'semantic-ui-react'

export default function Loading() {
    return <Grid.Row>
        <Loader indeterminate active inline="centered">
            Loading
        </Loader>
    </Grid.Row>
}