import { Link } from 'react-router-dom';


const NotFound = () => {
  return (
    <div className="not-found">
      <div className="not-found__code">404</div>
      <h1 className="not-found__title">Էջը չի գտնվել</h1>
      <p className="not-found__text">
        Ներեցեք, էջը որը փնտրում եք գոյություն չունի կամ տեղափոխվել է:
      </p>
      <Link to="/" className="not-found__btn">
        ← Վերադառնալ Գլխավոր
      </Link>
    </div>
  );
};

export default NotFound;
