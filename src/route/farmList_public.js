import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Pagination } from 'react-bootstrap';


export default function FarmListPubilc(){
    const navigate = useNavigate();

    const pubilcData = [
        {id:1, title:'서울텃밭', plant:'토마토, 깻잎, 상추'},
        {id:2, title:'금천구텃밭', plant:'상추, 딸기'},
        {id:3, title:'서울텃밭', plant:'토마토, 깻잎, 상추'},
        {id:4, title:'서울텃밭', plant:'토마토, 깻잎, 상추'},
        {id:5, title:'서울텃밭', plant:'토마토, 깻잎, 상추'},
        {id:6, title:'서울텃밭', plant:'토마토, 깻잎, 상추'},
        {id:7, title:'서울텃밭', plant:'토마토, 깻잎, 상추'},
        {id:7, title:'서울텃밭', plant:'토마토, 깻잎, 상추'},
        {id:9, title:'서울텃밭', plant:'토마토, 깻잎, 상추'},
        {id:10, title:'서울텃밭', plant:'토마토, 깻잎, 상추'},
        {id:11, title:'서울텃밭', plant:'토마토, 깻잎, 상추'},
        {id:12, title:'서울텃밭', plant:'토마토, 깻잎, 상추'},
        {id:13, title:'서울텃밭', plant:'토마토, 깻잎, 상추'},
    ]


    const handleClick = (id) => {
        navigate('/')
    };

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = pubilcData.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(pubilcData.length / itemsPerPage);
    
    const pageNumbers = [];
    for (let i =1; i<=totalPages; i++){
        pageNumbers.push(i);
    }


    return(
        <>
        <div className='publicList'>
            <div className='pubilctable'>
                
            </div>
        </div>
        
        </>
    )


}