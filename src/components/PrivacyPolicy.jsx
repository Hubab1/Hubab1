import React from 'react';
import captureRoute from 'app/captureRoute';
import { ROUTES } from 'app/constants';
import { chuck } from 'app/api';
import { useEffect } from 'react';
import { useState } from 'react';

export function PrivacyPolicy() {
    const [html, setHtml] = useState(null);
    useEffect(() => {
        fetch(chuck('/privacy-policy')).then((res) => {
            return res.text()
        }).then((res) => {
            setHtml(res)
        })
    }, [])
    if (!html) return null;
    console.log(html)
    return (
        <div>
            <div dangerouslySetInnerHTML={{
                __html: html
            }}/>
        </div>
    );
}

export default captureRoute(PrivacyPolicy, ROUTES.PRIVACY_POLICY);
