import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import Nav from "./components/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      <div className={styles.container}>
        <div className={styles.heading}>
          <h1>
            Health <span>Credit</span>{" "}
          </h1>
          <div className={styles.imageContainer}>
            <Image
              className={styles.image}
              src="/masai.jpg"
              width="500px"
              height="300px"
              alt=""
            ></Image>
          </div>
          <h4>
            Carbon credit <span>for health</span>
          </h4>
        </div>
        <div className={styles.detail}>
          <p>
            Healthcare funders like corporations, governments and foundations
            want to improve health in developing countries but they are unsure
            of the impact they are getting. This leads to long due diligence
            periods and less funding in the space that could save lives.
            Meanwhile, many health interventions go underfunded due to lack of
            awareness, accessibility and traceable impact.
          </p>
          <p>
            We are all familiar with this: when you see a company`s annual
            report say “We are helping maternal health in Africa” the reader
            wonders “Are they? How much? And how sure are they?”
          </p>
          <p>In the era of blockchains we need not be in doubt anymore.</p>

          <p>
            The Blockchain Era we can verify the impact of healthcare
            interventions.
          </p>

          <h3>Solution</h3>
          <p>
            {" "}
            We have created the first tradeable credit for health care impact.
            Think of this as similar to the unit of account of carbon credits to
            measure environmental impact and mitigate climate change. Instead of
            measuring a ton of carbon as a unit of account we use a disability
            adjusted life year, DALY. DALYs (pronounced DAH-lies) are a common
            unit of account in healthcare for the effectiveness of treatment.{" "}
          </p>

          <p>
            Using this standardized unit enables philanthropists to compare the
            cost effectiveness of different interventions. Did you know that
            heart surgery costs $25,000 per life year saved but giving a
            tuberculosis vaccine only costs $10 per life year saved? As a
            philanthropist you might want to donate to health interventions that
            can have the most impact. Until now, there was no marketplace for
            philanthropists to find and compare the most cost effective
            interventions.
          </p>

          <p>
            Since each health credit is one Life Year Saved we use the symbol
            $LYS for our token.
          </p>

          <p>
            In addition to the $LYS ERC1155 token for measuring impact, we have
            a governance token called $IMPACT. Holders of the governance token
            secure the protocol, verifying the impact of health Care
            organizations.
          </p>

          <p>
            <b>We have a secure system for validating this offchain data:</b>
          </p>

          <p>
            <b>Healthcare orgs upload evidence of their impact</b>
          </p>
          <p>
            <b>
              Owners of the $IMPACT protocol token approve/reject healthcare
              orgs
            </b>
          </p>
          <p>
            <b>
              Approved tokens are made available as health credits, $LYS, for
              philanthropists to buy as certified impact
            </b>
          </p>

          <p>
            If you are a healthcare organization go to [link] create a project.
            There you can upload evidence of extra years of life you provided to
            your patients. Then investors in our $impact token can
            approve/reject your impact.
          </p>

          <p>
            If you are an $IMPACT holder you have a vested interest in the
            protocols long-term success and an incentive to only approve valid
            projects. If you want to buy $IMPACT you can do so here. $IMPACT
            holders are randomly selected to validate projects. Regardless of
            whether they approve or reject, validators get the same validation
            fee. Approved projects are then listed on the marketplace as
            Verified Impact.
          </p>

          <p>
            If you are a philanthropist interested in funding impactful
            healthcare projects, go to Verified Projects page. There you can see
            a list of verified projects you can fund.
          </p>

          <p>
            Thanks for reading and being a part of the first tradeable health
            credit.
          </p>

          <p>If you want to learn more, read our whitepaper here [link]</p>
        </div>
      </div>
    </>
  );
}
