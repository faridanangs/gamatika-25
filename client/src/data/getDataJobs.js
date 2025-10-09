'use server';

const getDataJobs = async () => {
  try {
    const resp = await fetch(
      'https://jobdataapi.com/api/jobs/?country_code=ID',
      {
        method: 'GET',
      }
    );

    if (!resp.ok) {
      throw new Error('Failed To Fetch Jobs data');
    }

    const data = await resp.json();

    return data;
  } catch (error) {
    throw new Error(error || 'Network Error Occurred');
  }
};

export default getDataJobs;
