import ReactDOM from 'react-dom';
import Loading from 'components/Loading';
import styles from './index.module.scss';

const LoadingFullPage = ({ isLoading }: { isLoading: boolean }) => {
    if (!isLoading) return null;
    return ReactDOM.createPortal(
        <div className={styles.root}>
            <Loading />
        </div>,
        document.querySelector('body') as HTMLElement,
    );
};

export default LoadingFullPage;
