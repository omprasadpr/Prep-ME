import ScoreCard from "./ScoreCard";

function ScoreGrid({ report }) {

    return (

        <div
            className="
                grid
                grid-cols-1
                md:grid-cols-3
                gap-6
                mb-8
            "
        >

            <ScoreCard

                title="Technical"

                score={report.technical_score}

                type="technical"

            />

            <ScoreCard

                title="Communication"

                score={report.communication_score}

                type="communication"

            />

            <ScoreCard

                title="Confidence"

                score={report.confidence_score}

                type="confidence"

            />

        </div>

    );

}

export default ScoreGrid;