import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { ImageList } from './ImageList';

function Photo({ match }) {
    const { path } = match;

    return (
        <div className="p-4">
            <div className="container-fluid">
                <Switch>
                    <Route exact path={path} component={ImageList} />
                </Switch>
            </div>
        </div>
    );
}

export { Photo };
