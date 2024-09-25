import { useState, FormEvent, useEffect } from "react";
import styles from "./home.module.css";
import { BsSearch } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";

interface CoinProps {
  id: string;
  name: string;
  symbol: string;
  priceUsd: string;
  vwap24Hr: string;
  changePercent24Hr: string;
  rank: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  explorer: string;
  formatePrice?: string;
  formatedMarket?: string;
  formatedVolume?: string;
}

interface DataProp {
  data: CoinProps[];
}

export function Home() {
  const [input, setInput] = useState("");
  const [coins, setCoins] = useState<CoinProps[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    fetch("https://api.coincap.io/v2/assets?limit=10&offset=0")
      .then((Response) => Response.json())
      .then((data: DataProp) => {
        const coinsData = data.data;

        const price = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        });

        const priceCompact = Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          notation: "compact",
        });

        const formatedResult = coinsData.map((item) => {
          const formated = {
            ...item,
            formatedPrice: price.format(Number(item.priceUsd)),
            formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
            formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr)),
          };
          return formated;
        });

        setCoins(formatedResult);
      });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (input === "") return;

    navigate(` /detail/${input}`);
  }

  function handleGetMore() {
    alert("teste");
  }

  return (
    <main className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Digite o nome da moeda..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">
          <BsSearch size={30} color="#FFF" />
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th scope="col">Moeda</th>
            <th scope="col">Valor mercado</th>
            <th scope="col">Preço</th>
            <th scope="col">Volume</th>
            <th scope="col">Mudança de 24h</th>
          </tr>
        </thead>

        <tbody id="tbody">
          {coins.length > 0 &&
            coins.map((item) => (
              <tr className={styles.tr} key={item.id}>
                <td className={styles.tdLabel} data-Label="Moeda">
                  <div className={styles.name}>
                    <Link to={"/dateil"}>
                      <span>{item.name}</span> | {item.symbol}
                    </Link>
                  </div>
                </td>

                <td className={styles.tdLabel} data-Label="Valor mercado">
                  1T
                </td>

                <td className={styles.tdLabel} data-Label="Preço">
                  8.00
                </td>

                <td className={styles.tdLabel} data-Label="Volume">
                  2B
                </td>

                <td className={styles.tdProfit} data-Label="Mudança 24h">
                  <span>1.20</span>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <button className={styles.buttonMore} onClick={handleGetMore}>
        Carregar mais
      </button>
    </main>
  );
}
