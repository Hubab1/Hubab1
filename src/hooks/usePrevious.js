import { useRef, useEffect, useState } from 'react';
import API from '../app/api';

export default function usePrevious(value) {
    const ref = useRef();

    useEffect(() => {
        ref.current = value;
    });

    return ref.current;
}
