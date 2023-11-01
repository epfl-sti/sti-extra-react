import { useState, useEffect } from 'react';

export function useExternalScript(src: string): boolean | undefined {
  const [status, setStatus] = useState<boolean | undefined>();

  useEffect(() => {
    if (!src) {
      setStatus(undefined);
      return;
    }

    let script: HTMLScriptElement | null = null;
    if (status) {
      script = document.querySelector(`script[src="${src}"]`);
    }

    if (!script) {
      script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.setAttribute('data-status', 'loading');
      document.body.appendChild(script);

      const setAttributeFromEvent = (event: Event) => {
        script?.setAttribute(
          'data-status',
          event.type === 'load' ? 'ready' : 'error'
        );
      };

      script.addEventListener('load', setAttributeFromEvent);
      script.addEventListener('error', setAttributeFromEvent);
    } else {
      setStatus(script.getAttribute('data-status') === 'load');
    }

    const setStateFromEvent = (event: Event) => {
      setStatus(event.type === 'load');
    };

    script.addEventListener('load', setStateFromEvent);
    script.addEventListener('error', setStateFromEvent);

    return () => {
      if (script) {
        script.removeEventListener('load', setStateFromEvent);
        script.removeEventListener('error', setStateFromEvent);
      }
    };
  }, [src, status]);

  return status;
}
