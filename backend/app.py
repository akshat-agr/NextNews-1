from flask import Flask, request, render_template, redirect, url_for, jsonify
from flask_cors import CORS  # Import CORS
from elevenlabs.client import ElevenLabs
import json
import os
import requests
from serpapi import GoogleSearch
from bs4 import BeautifulSoup
from gtts import gTTS
import google.generativeai as genai
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)
GENAI_API_KEY = "AIzaSyDObieTwAqx4f7dAuR4vKAXDcZOargmVSw"
SERPAPI_API_KEY = "6565b5b63009879263438da3f4ee3f56e88bf1b1aa90c8a19ce03310294452d4"
genai.configure(api_key=GENAI_API_KEY)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/scrape', methods=['POST'])
def scrape_news():
    try:
        # Get data from the frontend as JSON
        data = request.get_json()
        gl = data.get("gl")
        q = data.get("q")

        logger.debug(f"Scraping news for query: {q}, region: {gl}")
        
        params = {
            "engine": "google_news",
            "q": q,
            "gl": gl,
            "hl": "en",
            "api_key": SERPAPI_API_KEY
        }
        
        search = GoogleSearch(params)
        results = search.get_dict()
        news_results = results.get("news_results", [])
        
        if not news_results:
            logger.warning("No news results found")
            return jsonify({"error": "No news results found"}), 404
        
        # Log and print the results to the console
        logger.debug(f"Found {len(news_results)} news results")
        
        # Display the result in the console (or terminal)
        for result in news_results:
            logger.debug(f"Title: {result.get('title')}, Link: {result.get('link')}")

        news_file_path = "news_results.json"
        with open(news_file_path, "w", encoding='utf-8') as file:
            json.dump(news_results, file, indent=4, ensure_ascii=False)
            
        logger.debug(f"Saved news results to {news_file_path}")
        return redirect(url_for('extract_titles'))  # Redirect to next step
        
    except Exception as e:
        logger.error(f"Error in scrape_news: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/extract_titles')
def extract_titles():
    try:
        input_file_path = "news_results.json"
        output_file_path = "output.json"
        
        logger.debug(f"Reading from {input_file_path}")
        
        if not os.path.exists(input_file_path):
            logger.error(f"File not found: {input_file_path}")
            return jsonify({"error": "News results file not found"}), 404
            
        with open(input_file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            
        # Limit to top 5 articles
        result = []
        count = 0
        
        # First try to get articles from main results
        for item in data:
            if count >= 5:
                break
                
            title = item.get("title")
            link = item.get("link")
            
            if title and link:
                result.append({
                    "title": title,
                    "link": link
                })
                count += 1
                logger.debug(f"Added article: {title[:50]}...")

        logger.debug(f"Extracted {len(result)} articles")
        
        with open(output_file_path, 'w', encoding='utf-8') as output_file:
            json.dump(result, output_file, indent=4, ensure_ascii=False)
            
        logger.debug(f"Saved extracted titles to {output_file_path}")
        return redirect(url_for('extract_content'))  # Redirect to next step
        
    except Exception as e:
        logger.error(f"Error in extract_titles: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/extract_content')
def extract_content():
    try:
        json_file_path = "output.json"
        output_file_path = "scraped_page_data.json"
        
        logger.debug(f"Reading from {json_file_path}")
        
        if not os.path.exists(json_file_path):
            logger.error(f"File not found: {json_file_path}")
            return jsonify({"error": "Articles file not found"}), 404
            
        with open(json_file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        # Extract content from all articles
        all_articles = []
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        for article in data:
            try:
                link = article["link"]
                logger.debug(f"Fetching content from: {link}")
                
                response = requests.get(link, headers=headers, timeout=10)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.content, "html.parser")
                
                # Remove script and style elements
                for script in soup(["script", "style"]):
                    script.decompose()
                
                # Get text and clean it
                text = soup.get_text(separator=' ', strip=True)
                # Remove extra whitespace
                text = ' '.join(text.split())
                
                all_articles.append({
                    "title": article["title"],
                    "link": link,
                    "content": text[:5000]  # Limit content length to avoid processing issues
                })
                logger.debug(f"Successfully extracted content from: {article['title'][:50]}...")

            except Exception as article_error:
                logger.error(f"Error extracting content from {link}: {str(article_error)}")
                continue
        
        if not all_articles:
            logger.error("No article content could be extracted")
            return jsonify({"error": "Failed to extract any article content"}), 500
        
        with open(output_file_path, 'w', encoding='utf-8') as output_file:
            json.dump(all_articles, output_file, indent=4, ensure_ascii=False)
            
        logger.debug(f"Saved scraped content to {output_file_path}")
        return redirect(url_for('summarize_news'))  # Redirect to next step
        
    except Exception as e:
        logger.error(f"Error in extract_content: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/summarize_news')
def summarize_news():
    try:
        input_file_path = "scraped_page_data.json"
        
        logger.debug(f"Reading from {input_file_path}")
        
        if not os.path.exists(input_file_path):
            logger.error(f"File not found: {input_file_path}")
            return jsonify({"error": "Scraped content file not found"}), 404
            
        with open(input_file_path, 'r', encoding='utf-8') as file:
            news_data = json.load(file)
        
        summaries = []
        for article in news_data:
            try:
                # Create a more focused prompt for better summaries
                prompt = f"""Please provide a concise news summary of the following article titled "{article['title']}". 
                Focus on the key facts and main points and present it like an news anchor is giving news: {article['content'][:2000]}"""
                
                logger.debug(f"Generating summary for: {article['title'][:50]}...")
                
                model = genai.GenerativeModel("gemini-1.5-flash")
                response = model.generate_content(prompt)
                
                summaries.append({
                    "title": article["title"],
                    "summary": response.text
                })
                logger.debug(f"Successfully generated summary for: {article['title'][:50]}...")
                
            except Exception as summary_error:
                logger.error(f"Error summarizing article {article['title']}: {str(summary_error)}")
                continue
        
        if not summaries:
            logger.error("No summaries could be generated")
            return jsonify({"error": "Failed to generate any summaries"}), 500
        
        with open("news_summary.txt", "w", encoding='utf-8') as file:
            for summary in summaries:
                file.write(summary['summary'])
                
        logger.debug("Saved all summaries to news_summary.txt")
        return redirect(url_for('generate_voice'))  # Redirect to next step
        
    except Exception as e:
        logger.error(f"Error in summarize_news: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/ask_question', methods=['POST'])
def ask_question():
    try:
        # Get the question from the JSON body
        data = request.get_json()
        question = data.get('question')
        
        if not question:
            return jsonify({"error": "No question provided"}), 400

        # Load articles data
        if not os.path.exists("scraped_page_data.json"):
            return jsonify({"error": "No article data available. Please scrape news first."}), 404

        with open("scraped_page_data.json", 'r', encoding='utf-8') as file:
            articles_data = json.load(file)
        
        # Combine article content for context
        context = "\n\n".join([
            f"Article: {article['title']}\n{article['content'][:1000]}" 
            for article in articles_data
        ])
        
        prompt = f"""Based on the following news articles:

{context}

Please answer this question: {question}

Provide a detailed answer for the question based only on the information contained in these articles.
The output has to mimic the actual response of a news anchor and should directly start with the news article."""
        
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content(prompt)
        
        return jsonify({
            "question": question,
            "answer": response.text
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/generate_voice')
def generate_voice():
    ELEVEN_API_KEY = "sk_c20de09377a45f62a77695e6a635eb375da84bd460e81844"

    try:
        if not os.path.exists("news_summary.txt"):
            logger.error("Summary file not found")
            return jsonify({"error": "No summary available to convert to speech"}), 404
            
        with open("news_summary.txt", "r", encoding='utf-8') as file:
            text = file.read().strip()
        
        if not text:
            logger.error("Summary file is empty")
            return jsonify({"error": "The summary file is empty"}), 400

        logger.debug("Generating speech from summary using ElevenLabs")

        # Initialize ElevenLabs client
        client = ElevenLabs(api_key=ELEVEN_API_KEY)

        # Convert text to speech
        audio_generator = client.text_to_speech.convert(
            text=text[:3000],  # Limit text length for voice generation
            voice_id="JBFqnCBsd6RMkjVDRZzb",
            model_id="eleven_multilingual_v2",
            output_format="mp3_44100_128",
        )

        # Save the generated audio
        output_file = "output.mp3"
        with open(output_file, "wb") as audio_file:
            for chunk in audio_generator:
                audio_file.write(chunk)

        logger.debug(f"Successfully saved speech to {output_file}")
        return jsonify({"message": f"Speech generated and saved as {output_file}"})
        
    except Exception as e:
        logger.error(f"Error in generate_voice: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/extract_news_thumbnails', methods=['POST'])
def extract_news_thumbnails():
    try:
        # Get form data (you can update this as per your requirement)
        gl = "in"  # Country code, e.g., 'in' for India
        q = "trending"  # Search query, e.g., 'trending' or any other keyword
        
        app.logger.debug(f"Extracting news for query: {q}, region: {gl}")

        # Search parameters for Google News API
        params = {
            "engine": "google_news",
            "q": q,
            "gl": gl,
            "hl": "en",  # Language code
            "api_key": "6565b5b63009879263438da3f4ee3f56e88bf1b1aa90c8a19ce03310294452d4"  # Make sure to set your API key
        }

        search = GoogleSearch(params)
        results = search.get_dict()
        news_results = results.get("news_results", [])

        if not news_results:
            app.logger.warning("No news results found")
            return jsonify({"error": "No news results found"}), 404

        app.logger.debug(f"Found {len(news_results)} news results")

        # Extract top 5 news titles and thumbnails
        result = []
        for item in news_results[:5]:
            title = item.get("title")
            link = item.get("link")
            thumbnail = item.get("thumbnail")

            if title and link:
                result.append({
                    "title": title,
                    "link": link,
                    "thumbnail": thumbnail if thumbnail else "No thumbnail available"
                })

        app.logger.debug(f"Extracted {len(result)} articles")

        # Return the result as JSON
        return jsonify(result), 200

    except Exception as e:
        app.logger.error(f"Error in extract_news_thumbnails: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/extract_top_trending_news', methods=['GET'])
def extract_top_trending_news():
    try:
        gl = "in"  # Country code, e.g., 'in' for India
        q = "latest"  # Search query, e.g., 'trending' or any other keyword
        
        logger.debug(f"Extracting top 5 trending news for query: {q}, region: {gl}")

        # Search parameters for Google News API
        params = {
            "engine": "google_news",
            "q": q,
            "gl": gl,
            "hl": "en",  # Language code
            "api_key": SERPAPI_API_KEY  # Ensure you are using the correct API key
        }

        search = GoogleSearch(params)
        results = search.get_dict()
        news_results = results.get("news_results", [])

        if not news_results:
            logger.warning("No news results found")
            return jsonify({"error": "No news results found"}), 404

        logger.debug(f"Found {len(news_results)} news results")


        source_ratings = {
            source.lower().strip(): rating for source, rating in {
                "The Indian Express": 4.9,
                "Hindustan Times": 4.83,
                "The Hindu": 4.8,
                "NDTV": 4.75,
                "Business Standard": 4.74,
                "The Times Of India": 4.74,
                "The Economic Times": 4.64,
                "MINT": 4.62,
                "Outlook India": 4.53,
                "India.Com": 4.31,
                "Dainik Bhaskar": 4.1,
                "The Hindu Business Line": 4.03,
                "Aaj Tak": 3.99,
                "India Today": 3.99,
                "Daily News & Analysis": 3.97,
                "Firstpost": 3.97,
                "Zee News": 3.94,
                "Dainik Jagran": 3.86,
                "Sportskeeda": 3.86,
                "Deccan Chronicle": 3.84,
                "Scroll.In": 3.79,
                "Times Now": 3.77,
                "Financial Express": 3.74,
                "Amar Ujala": 3.7,
                "The Telegraph": 3.7,
                "The Tribune": 3.7,
                "Anandabazar Patrika": 3.67,
                "Mathrubhumi": 3.67,
                "Mid Day": 3.57,
                "Gujarat Samachar": 3.52,
                "NDTV (New Delhi Television)": 3.45,
                "Lokmat": 3.42,
                "The New Indian Express": 3.42,
                "Malayala Manorama": 3.38,
                "Hindustan": 3.36,
                "The Navbharat Times": 3.36,
                "India TV": 3.33,
                "The Pioneer": 3.3,
                "Eenadu": 3.27,
                "The Quint": 3.27,
                "The Statesman": 3.27,
                "Outlook Business": 3.26,
                "Free Press Journal": 3.19,
                "Mykhel": 3.17,
                "The Siasat Daily": 3.17,
                "Divya Bhaskar": 3.14,
                "Prabhat Khabar": 3.14,
                "DD News": 3.08,
                "ABP Live": 3.00,
                "Daily Thanthi": 2.98,
                "Vikatan Magazines": 2.95,
                "ZEE5": 2.88,
                "Kerala Kaumudi": 2.84,
                "The Caravan": 2.82,
                "Deccan Herald": 2.82,
                "Nai Dunia": 2.82,
                "Pudhari": 2.82,
                "Business Insider India": 2.79,
                "SAKAL": 2.79,
                "Patrika": 2.72,
                "Daily Excelsior": 2.7,
                "Jansatta": 2.7,
                "The Sandesh": 2.7,
                "Pragativadi": 2.67,
                "Andhra Jyothi": 2.63,
                "Punjab Kesari": 2.63,
                "Dinamalar": 2.61,
                "PB-DD": 2.61,
                "Loksatta": 2.59,
                "Outlook Money": 2.59,
                "Hari Bhoomi": 2.52,
                "Maalai Malar": 2.49,
                "Malayala Manorama (Onmanorama)": 2.49,
                "Udayavani": 2.46,
                "News18": 2.41,
                "Rashtriya Sahara": 2.39,
                "Sakshi": 2.39,
                "Chitralekha": 2.24,
                "Saamana": 2.22,
                "Deepika": 2.2,
                "Ajit": 2.18,
                "Dinamani": 2.18,
                "Lokmat Times": 2.14,
                "Punjabi Tribune": 2.14,
                "Vaartha": 2.14,
                "Bombay Samachar Daily": 2.09,
                "Deshabhimani": 2.09,
                "Ei Samay": 2.09,
                "Madhyamam": 2.02,
                "Outlook Hindi": 2.00,
                "Kumudam": 1.98,
                "Prajasakti": 1.98,
                "Bartaman": 1.94,
                "Dinakaran": 1.92,
                "Prajavani": 1.92,
                "Aajkaal": 1.89,
                "Dainik Tribune": 1.85,
                "Reader’s Digest India": 1.83,
                "Namasthe Telangana": 1.81,
                "Dharitri": 1.79,
                "Inquilab": 1.75,
                "Punjabi Jagran": 1.75,
                "Tarun Bharat": 1.7,
                "IBC 24": 1.68,
                "Sambad": 1.68,
                "Sangbad Pratidin": 1.66,
                "Kashmir Times": 1.61,
                "Gujarati Mid Day": 1.57,
                "The Maharashtra Times": 1.55,
                "Andhra Prabha": 1.55,
                "Gujarati Jagran": 1.53,
                "The Hitavada": 1.53,
                "DJ-Inext": 1.51,
                "Mangalam Daily": 1.51,
                "O Herald O": 1.49,
                "Gomantak": 1.44,
                "Gomantak Times": 1.41,
                "Dainik Navajyoti": 1.37,
                "Raj Express": 1.33,
                "Suprabhaatham Daily": 1.31,
                "Vijayavani": 1.29,
                "Sanmarg": 1.26,
                "First India News": 1.24,
                "Asomiya Pratidin": 1.19,
                "Navabharat": 1.14,
                "The Samaja": 1.14,
                "Zee Media Corporation": 1.14,
                "Navarashtra": 1.12,
                "Star Sports Asia": 1.11,
                "Daily Hindi Milap": 1.06,
                "DD India": 1.05,
                "The Navhind Times": 1.05,
                "Charhdikala Daily": 1.00,
                "Aaj Samaj": 0.98,
                "Pratidin Akhbar": 0.96,
                "Dainik Sambad": 0.95,
                "The Samaya": 0.92,
                "Daily Deshonnati": 0.88,
                "Janmabhoomi": 0.86,
                "Khabar Fast": 0.86,
                "Alive": 0.84,
                "Daily Milap": 0.84,
                "Dainik Rashtradoot": 0.84
            }.items()
        }


        # Extract top 5 news titles and thumbnails
        result = []
        for item in news_results[:15]:
            title = item.get("title")
            link = item.get("link")
            thumbnail = item.get("thumbnail")
            source_info = item.get("source", {})
            source_name = source_info.get("name", "Unknown Source")
            normalized_source_name = source_name.lower().strip()
            rating = source_ratings.get(normalized_source_name, "Rating not available")

            result.append({
                "title": title,
                "link": link,
                "thumbnail": thumbnail,
                "source": source_name,
                "rating": rating
            })
            # if title and link:
            #     result.append({
            #         "title": title,
            #         "link": link,
            #         "thumbnail": thumbnail if thumbnail else "No thumbnail available"
            #     })

        logger.debug(f"Extracted {len(result)} articles")

        # Save the extracted data to a JSON file
        output_file_path = "top_trending_news.json"
        with open(output_file_path, 'w', encoding='utf-8') as output_file:
            json.dump(result, output_file, indent=4, ensure_ascii=False)

        logger.debug(f"Saved trending news to {output_file_path}")
        output_file_path = "top_trending_news.json"
        with open(output_file_path, 'w', encoding='utf-8') as output_file:
            json.dump(result, output_file, indent=4, ensure_ascii=False)

        logger.debug(f"Saved trending news to {output_file_path}")
        print(jsonify(result))
        # Return the extracted news data
        return jsonify(result), 200

    except Exception as e:
        logger.error(f"Error in extract_top_trending_news: {str(e)}")
        return jsonify({"error": str(e)}), 500


# extract_top_trending_news()   
if __name__ == "__main__":
    app.run(debug=True)
