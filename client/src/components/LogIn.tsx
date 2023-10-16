import * as React from 'react'
import Auth from '../auth/Auth'
import { Button, Grid, Segment } from 'semantic-ui-react'

interface LogInProps {
    auth: Auth
}

interface LogInState {}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
    onLogin = () => {
        this.props.auth.login()
    }

    render() {
        return (
            <Grid centered columns={3}>
                <Grid.Column className="center">
                    <Segment className="center">
                          <h1 className="center mts">Please log in</h1>
                          <Button className="center mts" onClick={this.onLogin} size="huge" color="teal">
                                Log in
                          </Button>
                    </Segment>
                </Grid.Column>
            </Grid>
        )
    }
}
