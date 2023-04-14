import { useEffect, useState } from 'react';
import './style.scss';
import { Button } from '@mui/material';
import { getTemplateByCategory } from 'apis/template';
import { createCv } from 'apis/cv';
import { Template } from 'utils/types';
import LoadingFullPage from 'components/LoadingFullPage';
import { useDispatch } from 'react-redux';
import { editAction } from 'redux/EditCV/slice';
import useNavigateParams from 'hooks/useNavigateParams';
import { useSelector } from 'react-redux';
import { getAllTemplate } from 'apis/template';

interface IProps {
    category: string;
}

const TemplateCv = ({ category }: IProps) => {
    const currentAccount = useSelector((state: any) => state?.user?.currentUser);
    const dispatch = useDispatch();
    const navigate = useNavigateParams();
    const [isLoading, setIsLoading] = useState(false);
    const [loaded, setIsLoaded] = useState(false);
    const [dataCV, setDataCV] = useState<Template[]>([]);
    const [allCV, setAllCV] = useState<Template[]>([]);

    const getData = async () => {
        const data = await getAllTemplate() ;
        if (!data) return;
        setDataCV(data);
        let array = data;
        let currentIndex = array.length,
            randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        setAllCV(array);
    };
    useEffect(() => {
        getData();
    }, [category]);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const img: any = entry.target;
                        img.src = img.dataset.src;
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 1,
            },
        );
        document.querySelectorAll('img[data-src]').forEach((img) => {
            observer.observe(img);
        });
    }, []);

    const handleCreateCv = (id: string) => {
        try {
            setIsLoading(true);
            if (currentAccount)
                createCv({ templateId: id })
                    .then((response) => {
                        dispatch(
                            editAction.selectCV({
                                cvId: response.data.data.id,
                            }),
                        );
                        navigate('/edit-cv', { cvId: response.data.data.id });
                    })
                    .finally(() => {
                        setIsLoading(false);
                    });
            else navigate('/login');
        } catch (e) {}
    };

    return (
        <div className="list-cv">
            <LoadingFullPage isLoading={isLoading} />
            {allCV &&
                allCV.map((cv) => {
                    return (
                        <div key={cv.id} className="list-cv__items">
                            <div className="list-cv__items--img">
                                <div className="img-hover">
                                    <img
                                        src={cv.urlImage}
                                        data-src={cv.urlImage}
                                        alt=""
                                        className={loaded ? 'loaded' : 'loading'}
                                        onLoad={() => setIsLoaded(true)}
                                    />
                                    <div className="overlay">
                                        <div className="overlay__show">
                                            <Button
                                                style={{
                                                    borderRadius: 8,
                                                    backgroundColor: '#2A3FFB',
                                                    fontSize: '15px',
                                                    padding: '15px',
                                                    fontWeight: '400',
                                                    textTransform: 'none',
                                                    lineHeight: '15px',
                                                    fontFamily: 'Inter, sans-serif',
                                                }}
                                                variant="contained"
                                                onClick={() => handleCreateCv(cv.id)}
                                            >
                                                Create your resume
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="list-cv__items--title">{cv.name}</div>
                            <div className="list-cv__items--content">
                                <p>{cv.description}</p>
                            </div>
                        </div>
                    );
                })}
        </div>
    );
};

export default TemplateCv;
