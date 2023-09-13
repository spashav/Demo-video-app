import styles from './full-info.module.css';

import cn from 'clsx';
import { useApi } from '../../utils/use-api';

interface FullInfo {
  id: string;
  title: string;
  description: string;
}

export function FullInfo({
  id,
  className,
}: {
  id: string;
  className: string;
}) {
  const fullInfo = useApi<FullInfo>({ apiUrl: `/watch/${id}` });
  if (!fullInfo.response) {
    return null
  }
  return <div className={cn(styles.fullInfo, className)}>
    <h1 className={styles.title}>{fullInfo.response.title}</h1>
    <div className={styles.description}>{fullInfo.response.description}</div>
  </div>;
}
