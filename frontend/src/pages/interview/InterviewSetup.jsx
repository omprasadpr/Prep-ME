import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    createInterview,
    generateQuestions,
} from "../../services/interviewApi";
function InterviewSetup() {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        role: "",
        experience: "",
        difficulty: "",
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            // Step 1
            const interview = await createInterview(formData);

            // Step 2
            await generateQuestions(interview.id);

            // Step 3
            navigate(`/interview/session/${interview.id}`);

        }

        catch (error) {

            console.log(error);

            alert("Unable to create interview.");

        }

        finally {

            setLoading(false);

        }

    };

    return (

        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow">

            <h1 className="text-3xl font-bold mb-6">

                Start Interview

            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                <input

                    type="text"

                    name="title"

                    placeholder="Interview Title"

                    value={formData.title}

                    onChange={handleChange}

                    className="w-full border rounded-lg p-3"

                    required

                />

                <input

                    type="text"

                    name="role"

                    placeholder="Role"

                    value={formData.role}

                    onChange={handleChange}

                    className="w-full border rounded-lg p-3"

                    required

                />

                <select

                    name="experience"

                    value={formData.experience}

                    onChange={handleChange}

                    className="w-full border rounded-lg p-3"

                    required

                >

                    <option value="">Experience</option>

                    <option>Fresher</option>

                    <option>1-2 Years</option>

                    <option>3-5 Years</option>

                    <option>5+ Years</option>

                </select>

                <select

                    name="difficulty"

                    value={formData.difficulty}

                    onChange={handleChange}

                    className="w-full border rounded-lg p-3"

                    required

                >

                    <option value="">Difficulty</option>

                    <option>Easy</option>

                    <option>Medium</option>

                    <option>Hard</option>

                </select>

                <button

                    disabled={loading}

                    className="w-full bg-blue-600 text-white rounded-lg py-3"

                >

                    {

                        loading

                            ? "Generating Interview..."

                            : "Start Interview"

                    }

                </button>

            </form>

        </div>

    );

}

export default InterviewSetup;