// src/pages/AboutPage.jsx
import Layout from '../components/layout/Layout';

const AboutPage = () => {
    return (
        <Layout>
            <div className="container mx-auto py-12 px-4">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">About JobBoard</h1>

                    <div className="prose lg:prose-lg">
                        <p>
                            JobBoard is a modern job marketplace connecting talented professionals with top employers.
                            Our platform makes it easy for job seekers to find opportunities that match their skills
                            and career goals, while helping companies find the perfect candidates for their open positions.
                        </p>

                        <h2>Our Mission</h2>
                        <p>
                            We believe that finding the right job or the right candidate should be simple, efficient,
                            and transparent. Our mission is to create a seamless experience that removes the friction from
                            the hiring process, benefiting both job seekers and employers.
                        </p>

                        <h2>For Job Seekers</h2>
                        <p>
                            JobBoard provides powerful tools to help you discover and apply to jobs that align with your
                            skills, experience, and career aspirations. Save interesting positions, track your applications,
                            and showcase your talents to potential employers.
                        </p>

                        <h2>For Employers</h2>
                        <p>
                            Post job openings, manage applications, and connect with qualified candidates all in one place.
                            Our platform helps you streamline your hiring process, saving you time and resources while finding
                            the perfect fit for your team.
                        </p>

                        <h2>Get Started Today</h2>
                        <p>
                            Whether you're looking for your next career move or searching for talent to grow your team,
                            JobBoard is here to help. Create an account today and take the first step toward your hiring
                            or career goals.
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AboutPage;
